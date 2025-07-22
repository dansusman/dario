# Margin Notes Usage Guide

This theme now supports margin notes - optional notes that appear in the right margin to provide extra clarification for paragraphs, similar to academic papers and textbooks.

## How to Use

### Method 1: Manual HTML (Recommended)

In your markdown content, wrap the text you want to annotate with the margin note HTML:

```html
This is regular text, but <span class="margin-note-trigger" data-note-id="note1" data-note="This is additional context that explains the concept in more detail.">this highlighted phrase</span> has additional context.

<div class="margin-note" data-note-id="note1">
This is additional context that explains the concept in more detail. It can be longer and provide detailed explanations.
</div>
```

### Method 2: Using JavaScript Helper

You can also create margin notes programmatically:

```javascript
// Find the element you want to annotate
const element = document.querySelector('.some-text');

// Create a margin note
MarginNotes.create(element, 'Your margin note content here', 'unique-id');
```

## Features

- **Responsive Design**: On desktop screens (≥1200px), notes appear in the right margin
- **Mobile Fallback**: On smaller screens, notes show as tooltips on hover
- **Interactive**: Hovering over triggers highlights the corresponding notes and vice versa
- **Dark Mode**: Fully compatible with the theme's dark mode
- **TOC Aware**: Positioning adjusts when table of contents is present

## Styling

Margin notes are styled to match your theme with:
- Italic text for distinction
- Semi-transparent appearance
- Left border accent
- Subtle background and shadow
- Smooth hover animations

## Best Practices

1. Keep margin notes concise but informative
2. Use unique IDs for each note pair
3. Place margin note divs after the paragraph containing the trigger
4. Don't overuse - reserve for truly important clarifications
5. Test on both desktop and mobile to ensure good UX

## Example in Context

Here's how it looks in a blog post:

```markdown
# Understanding Retrieval Practice

Retrieval practice prompts should produce <span class="margin-note-trigger" data-note-id="consistent" data-note="This means getting the same answer every time you practice, which reinforces memory.">consistent answers</span>, lighting the same bulbs each time you perform the task.

<div class="margin-note" data-note-id="consistent">
This means getting the same answer every time you practice, which reinforces memory formation and prevents confusion.
</div>

This approach helps avoid the <span class="margin-note-trigger" data-note-id="interference" data-note="When practicing inconsistent information interferes with what you're trying to learn.">interference phenomenon</span> called "retrieval-induced forgetting".

<div class="margin-note" data-note-id="interference">
When practicing inconsistent information interferes with what you're trying to learn, making it harder to recall later.
</div>
```