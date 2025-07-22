// Auto-convert markdown patterns to margin notes
document.addEventListener('DOMContentLoaded', function() {
    processAutoMarginNotes();
});

function processAutoMarginNotes() {
    // Find all text content and process margin note patterns
    const contentContainer = document.querySelector('.content-container');
    if (!contentContainer) return;
    
    // Look for pattern: [trigger text]{margin note content}
    const pattern = /\[([^\]]+)\]\{([^}]+)\}/g;
    
    processTextNodes(contentContainer, pattern);
    
    // Initialize margin notes after processing
    if (window.MarginNotes && window.MarginNotes.initialize) {
        window.MarginNotes.initialize();
    } else if (typeof initializeMarginNotes === 'function') {
        // Fallback to the existing initialization
        setTimeout(initializeMarginNotes, 100);
    } else {
        // If initializeMarginNotes isn't available yet, wait for it
        console.log('Waiting for margin-notes.js to load...');
        setTimeout(() => {
            if (typeof initializeMarginNotes === 'function') {
                initializeMarginNotes();
            } else {
                console.error('initializeMarginNotes function not found');
            }
        }, 200);
    }
}

function processTextNodes(element, pattern) {
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                // Skip script and style elements
                const parent = node.parentElement;
                if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE')) {
                    return NodeFilter.FILTER_REJECT;
                }
                // Only process text nodes that contain our pattern
                return pattern.test(node.textContent) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            }
        }
    );
    
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }
    
    // Process each text node
    textNodes.forEach(textNode => {
        processTextNode(textNode, pattern);
    });
}

let noteCounter = 0;

function processTextNode(textNode, pattern) {
    const text = textNode.textContent;
    const matches = [...text.matchAll(pattern)];
    
    if (matches.length === 0) return;
    
    const parent = textNode.parentElement;
    const contentContainer = parent.closest('.content-container');
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    
    matches.forEach((match, index) => {
        const [fullMatch, triggerText, noteContent] = match;
        const matchStart = match.index;
        
        // Add text before the match
        if (matchStart > lastIndex) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex, matchStart)));
        }
        
        // Create margin note elements
        const noteId = `auto-note-${++noteCounter}`;
        
        const trigger = document.createElement('span');
        trigger.className = 'margin-note-trigger';
        trigger.setAttribute('data-note-id', noteId);
        trigger.setAttribute('data-note', noteContent);
        trigger.textContent = triggerText;
        
        const note = document.createElement('div');
        note.className = 'margin-note';
        note.setAttribute('data-note-id', noteId);
        note.textContent = noteContent;
        
        // Put trigger in fragment
        fragment.appendChild(trigger);
        
        // Put note in the paragraph (not the trigger) for proper positioning
        const paragraph = parent.closest('p') || parent.closest('li') || parent.closest('div');
        if (paragraph) {
            // Make sure paragraph has relative positioning
            if (getComputedStyle(paragraph).position === 'static') {
                paragraph.style.position = 'relative';
            }
            paragraph.appendChild(note);
        }
        
        lastIndex = matchStart + fullMatch.length;
    });
    
    // Add remaining text after the last match
    if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }
    
    // Replace the original text node with the processed fragment
    parent.replaceChild(fragment, textNode);
}