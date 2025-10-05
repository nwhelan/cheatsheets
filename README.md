# Cheat Sheet System

A markdown-to-HTML cheat sheet generation system for creating print-optimized reference materials. Write in markdown, view in beautifully styled HTML with syntax highlighting, print on a single landscape page.

## Features

- **Markdown Source**: Write content in simple, readable markdown
- **4-Column Layout**: Multi-column layout optimized for landscape printing
- **Syntax Highlighting**: Powered by Prism.js for beautiful code blocks
- **Browser-based Converter**: No installation required, works offline
- **CLI Generator**: Node.js script for quick batch generation
- **Global Stylesheet**: Consistent styling across all cheat sheets
- **Print-Optimized**: Balanced columns, single-page output
- **Responsive**: Fills viewport width, adapts to window size

## Quick Start

### Option 1: Browser Converter (Recommended for First-Time Users)

```bash
# Open the converter
open tools/converter.html

# Load a markdown file or paste content
# Click "Convert to HTML" to preview
# Click "Download HTML" to save
```

### Option 2: CLI Generator (Fast for Multiple Sheets)

```bash
# Generate a cheat sheet from markdown
node tools/generate.js python

# This reads cheatsheets/python.md
# and creates cheatsheets/python.html
```

## Project Structure

```
cheatsheets/
├── cheatsheets/           # Generated cheat sheets
│   ├── python.md          # Example: Python markdown source
│   ├── python.html        # Example: Python generated HTML
│   ├── fastapi.md         # Example: FastAPI markdown source
│   └── fastapi.html       # Example: FastAPI generated HTML
├── styles/
│   └── cheatsheet.css     # Global stylesheet with syntax highlighting
├── tools/
│   ├── converter.html     # Browser-based converter
│   └── generate.js        # CLI generation script
├── docs/
│   └── prd.md            # Product requirements document
├── README.md             # This file
└── AGENT_INSTRUCTIONS.md # Instructions for AI agents
```

## Workflows

### Create New Cheat Sheet (Browser)

1. Open `tools/converter.html` in browser
2. Enter a title (e.g., "JavaScript Quick Reference")
3. Load a `.md` file or paste markdown content
4. Preview updates automatically
5. Click "Download HTML" to save
6. Move files to appropriate directories

**Time:** < 5 minutes

### Create New Cheat Sheet (CLI)

1. Create `cheatsheets/[subject].md` with content
2. Run `node tools/generate.js [subject]`
3. Open `cheatsheets/[subject].html` in browser

**Time:** < 2 minutes

### Update Existing Cheat Sheet

1. Edit `cheatsheets/[subject].md`
2. Regenerate: `node tools/generate.js [subject]`
3. Refresh browser to see changes

### Update Global Styles

1. Edit `styles/cheatsheet.css`
2. Refresh any HTML file in browser
3. Changes apply to all sheets

**Time:** Instant

## Markdown Structure

### Basic Template

```markdown
# Main Title

## Section Name

Brief explanation of section (only if no H3 subsections below).

### Subsection
One-sentence explanation of why you'd use this feature or what problem it solves.

- List item with `inline code`
- Another item

\`\`\`python
# Code block with syntax highlighting
def example():
    return "formatted"
\`\`\`

**Bold text** for emphasis
*Italic text* for secondary emphasis
```

### Writing Guidelines

**Explanatory Sentences:**
- Add a brief one-sentence explanation after each H3 header
- If an H2 has no H3 subsections, add explanation after H2
- Describes **why** you'd use the feature or **what problem it solves**
- Keep concise - one sentence, ideally under 15 words

**Examples:**
- "Reuse common logic across multiple endpoints without code duplication"
- "Extract dynamic values from the URL path with automatic type validation"
- "Handle file uploads from multipart form data"

### Supported Languages

Code blocks support syntax highlighting for:
- Python (`python`)
- JavaScript (`javascript`)
- Bash/Shell (`bash`)
- Add more by including additional Prism.js language components

### Styling Guide

- **H1**: Main title (spans all columns)
- **H2**: Major sections (blue background, white text)
- **H3**: Subsections (bold, keeps with content)
- **H4**: Minor headings
- **Inline code**: Pink/magenta highlight
- **Code blocks**: Syntax highlighted with Prism.js
- **Bold**: Strong emphasis
- **Italic**: Secondary emphasis
- **Lists**: Standard bullet/numbered lists

## Layout System

### Multi-Column Layout

The system uses CSS multi-column layout for natural top-to-bottom flow:

```css
.cheatsheet-container {
  column-count: 4;
  column-gap: 1rem;
  column-fill: balance;
}
```

**Behavior:**
- Content flows **top-to-bottom** within each column
- Then moves to the next column (**left-to-right**)
- Columns are balanced to similar heights
- Sections stay together (no mid-section breaks)

### Responsive Design

- **Screen**: Fills full viewport width, adapts to window resize
- **Print**: Fixed landscape layout, balanced columns

## Styling

### Color Scheme

- **Primary**: #2c3e50 (dark blue-gray)
- **Secondary**: #3498db (blue - h2 backgrounds)
- **Accent**: #e74c3c (red)
- **Success**: #27ae60 (green)
- **Code**: #d63384 (pink/magenta)

### Syntax Highlighting Colors

- **Comments**: Gray #6a737d
- **Strings**: Green #22863a
- **Keywords**: Red #d73a49
- **Functions**: Purple #6f42c1
- **Numbers**: Blue #005cc5
- **Variables**: Orange #e36209

### Typography

- **Sans-serif**: System fonts (-apple-system, BlinkMacSystemFont, etc.)
- **Monospace**: Monaco, Menlo, Consolas
- **Base size**: 11px screen, 9px print

## Print Optimization

The stylesheet includes special print rules:

```css
@media print {
  @page {
    size: landscape;
    margin: 0.4in;
  }
}
```

**Features:**
- Automatic landscape orientation
- Balanced columns for even distribution
- Page break prevention inside sections
- Optimized font sizes for readability
- Print-friendly syntax highlighting colors

**How to Print:**
1. Open HTML file in browser
2. Press `Cmd/Ctrl + P`
3. Verify landscape orientation is set
4. Print or save as PDF

## CLI Usage

### Generate Single Sheet

```bash
node tools/generate.js python
# Reads: cheatsheets/python.md
# Creates: cheatsheets/python.html
```

### Generate Multiple Sheets

```bash
# Create a simple script
for sheet in python fastapi javascript; do
  node tools/generate.js $sheet
done
```

### Notes
- Script expects markdown files in `cheatsheets/` directory
- Generated HTML files are saved to `cheatsheets/` directory
- References `styles/cheatsheet.css` with relative path

## Dependencies

### Runtime (Browser)
- Modern browser with CSS multi-column support
- JavaScript enabled

### Development (CLI)
- Node.js (any recent version)
- `marked` package for markdown parsing

```bash
npm install marked
```

### External Resources (CDN)
- Prism.js for syntax highlighting
- Loaded from CDN, works offline after first load

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Minimum**: Any browser with CSS multi-column layout support (2011+)

## Tips & Best Practices

1. **Keep it concise**: Aim for single-page output
2. **Use hierarchy**: H2 for major topics, H3 for subtopics
3. **Code examples**: Specify language for syntax highlighting
4. **Visual breaks**: Use headings to organize content
5. **Test print**: Preview print layout during creation
6. **Consistent naming**: Use lowercase, hyphens for filenames

## Troubleshooting

### Content overflows page
- Reduce content or font size
- Use more concise descriptions
- Split into multiple cheat sheets

### Columns unbalanced
- Add more content
- Adjust `column-fill` property
- Reorganize section breaks

### Syntax highlighting not working
- Check code block language specification
- Verify Prism.js loaded (check browser console)
- Add language support in generate.js if needed

### Styles not applying
- Verify `styles/cheatsheet.css` path is correct
- Check browser console for 404 errors
- Refresh browser cache (Cmd/Ctrl + Shift + R)

### File paths broken after reorganization
- Ensure relative paths are correct
- HTML files reference `../styles/cheatsheet.css`
- Update paths in converter.html if moved

## Development Roadmap

### Phase 1: MVP ✓
- [x] Global stylesheet with multi-column layout
- [x] Browser-based converter
- [x] CLI generator script
- [x] Syntax highlighting with Prism.js
- [x] Example cheat sheets (Python, FastAPI)
- [x] Documentation
- [x] Organized project structure

### Phase 2: Frozen Styles (Future)
- [ ] Implement cascade pattern for style freezing
- [ ] Create example frozen stylesheet
- [ ] Document freezing workflow
- [ ] Per-sheet style overrides

### Phase 3: Enhancements (Future)
- [ ] Additional syntax highlighting languages
- [ ] Theme variants (dark mode, minimal, etc.)
- [ ] Auto-deploy to static site
- [ ] Search functionality
- [ ] Table of contents generation

## Contributing

This is a personal learning tool. Feel free to fork and adapt:

1. Modify `styles/cheatsheet.css` for your preferred styling
2. Extend `tools/converter.html` for additional features
3. Add more language support in Prism.js includes
4. Create custom themes

## License

Free to use and modify for personal projects.

---

**Created**: October 2025
**Version**: 1.0
**Status**: Phase 1 Complete
