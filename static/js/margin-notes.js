// Margin Notes functionality
console.log('Margin notes script loaded');
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing margin notes');
    initializeMarginNotes();
});

function initializeMarginNotes() {
    // Find all margin note triggers and position their corresponding notes
    const triggers = document.querySelectorAll('.margin-note-trigger');
    console.log(`Found ${triggers.length} margin note triggers`);
    
    triggers.forEach(trigger => {
        const noteId = trigger.getAttribute('data-note-id');
        const note = document.querySelector(`.margin-note[data-note-id="${noteId}"]`);
        
        console.log(`Processing trigger with ID: ${noteId}, found note: ${!!note}`);
        
        if (note) {
            // No positioning needed - CSS handles it
            
            // Add event listeners for hover effects
            trigger.addEventListener('mouseenter', () => {
                console.log('Trigger hovered:', noteId);
                highlightNote(note);
            });
            trigger.addEventListener('mouseleave', () => {
                console.log('Trigger unhovered:', noteId);
                unhighlightNote(note);
            });
            note.addEventListener('mouseenter', () => {
                console.log('Note hovered:', noteId);
                highlightTrigger(trigger);
            });
            note.addEventListener('mouseleave', () => {
                console.log('Note unhovered:', noteId);
                unhighlightTrigger(trigger);
            });
        } else {
            console.warn(`No margin note found for ID: ${noteId}`);
        }
    });
    
    // No resize handling needed
}

// No positioning function needed - CSS handles everything

function highlightNote(note) {
    console.log('Highlighting note:', note);
    // Bring this note to front and dim others
    const allNotes = document.querySelectorAll('.margin-note');
    console.log('Found', allNotes.length, 'total notes');
    
    allNotes.forEach(otherNote => {
        if (otherNote === note) {
            console.log('Adding active class to current note');
            otherNote.classList.add('active');
            otherNote.classList.remove('dimmed');
        } else if (isOverlapping(note, otherNote)) {
            console.log('Dimming overlapping note');
            otherNote.classList.add('dimmed');
            otherNote.classList.remove('active');
        }
    });
}

function unhighlightNote(note) {
    // Reset all notes to normal state
    const allNotes = document.querySelectorAll('.margin-note');
    
    allNotes.forEach(otherNote => {
        otherNote.classList.remove('active', 'dimmed');
    });
}

function isOverlapping(note1, note2) {
    const rect1 = note1.getBoundingClientRect();
    const rect2 = note2.getBoundingClientRect();
    
    return !(rect1.right < rect2.left || 
             rect2.right < rect1.left || 
             rect1.bottom < rect2.top || 
             rect2.bottom < rect1.top);
}

function highlightTrigger(trigger) {
    console.log('Highlighting trigger:', trigger);
    trigger.classList.add('active');
}

function unhighlightTrigger(trigger) {
    console.log('Unhighlighting trigger:', trigger);
    trigger.classList.remove('active');
}

// Utility function to debounce resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Helper function to create margin notes programmatically
function createMarginNote(triggerElement, noteText, noteId) {
    // Create the trigger wrapper if it doesn't exist
    if (!triggerElement.classList.contains('margin-note-trigger')) {
        triggerElement.classList.add('margin-note-trigger');
        triggerElement.setAttribute('data-note-id', noteId);
        triggerElement.setAttribute('data-note', noteText); // For mobile tooltips
    }
    
    // Create the margin note element
    const note = document.createElement('div');
    note.className = 'margin-note';
    note.setAttribute('data-note-id', noteId);
    note.innerHTML = noteText;
    
    // Add the note to the paragraph containing the trigger
    const paragraph = triggerElement.closest('p') || triggerElement.closest('li') || triggerElement.closest('div');
    if (paragraph) {
        if (getComputedStyle(paragraph).position === 'static') {
            paragraph.style.position = 'relative';
        }
        paragraph.appendChild(note);
    }
    
    // Add event listeners
    triggerElement.addEventListener('mouseenter', () => highlightNote(note));
    triggerElement.addEventListener('mouseleave', () => unhighlightNote(note));
    note.addEventListener('mouseenter', () => highlightTrigger(triggerElement));
    note.addEventListener('mouseleave', () => unhighlightTrigger(triggerElement));
    
    return note;
}

// Export for use in other scripts
window.MarginNotes = {
    create: createMarginNote,
    initialize: initializeMarginNotes
};