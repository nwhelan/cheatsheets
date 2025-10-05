# Cheat Sheet System - Product Requirements Document

## Executive Summary

A markdown-to-HTML cheat sheet generation system enabling rapid creation of visually optimized reference materials for personal learning. The system balances AI agent readability (markdown source) with human visual learning (styled HTML output) while supporting both global stylesheet evolution and subject-specific style freezing.

---

## Core Requirements

### 1. Content Management

**Source Format:** Markdown (.md)
- Human-readable and writable
- AI agent compatible for knowledge retrieval
- Version controllable
- No proprietary dependencies

**Output Format:** HTML with embedded/linked CSS
- Optimized for landscape printing (11×8.5" or A4 landscape)
- 4-column layout capability
- High visual differentiation for learning retention

### 2. Styling Architecture

**Global Stylesheet** (`cheatsheet.css`)
- Default styling for all cheat sheets
- Continuously evolving as design preferences emerge
- Applies to all sheets unless overridden

**Frozen Stylesheets** (`[subject]-frozen.css`)
- Subject-specific style locks
- Override global styles via CSS cascade
- Enable partial freezing (e.g., lock color scheme, allow typography updates)

**Cascade Implementation:**
```html
<link rel="stylesheet" href="cheatsheet.css">
<link rel="stylesheet" href="python-frozen.css">
```

**Rationale:** Frozen sheets receive global updates but preserve locked elements through higher-specificity overrides.

### 3. Conversion Mechanism

**Tool Type:** Browser-based converter
- No server dependencies
- Immediate preview capability
- Uses marked.js or equivalent for markdown parsing

**Input:** Markdown file content
**Output:** Complete HTML document with stylesheet links

**Template Structure:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>[Subject] Cheat Sheet</title>
  <link rel="stylesheet" href="cheatsheet.css">
  <!-- Optional: <link rel="stylesheet" href="[subject]-frozen.css"> -->
</head>
<body>
  [Converted markdown content]
</body>
</html>
```

---

## Technical Specifications

### Layout System

**4-Column Implementation Options:**

**Option A: CSS Grid (Recommended)**
```css
.cheatsheet-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  grid-auto-flow: dense;
}

.section {
  grid-column: span 1; /* default */
}

.section.wide {
  grid-column: span 2;
}
```

**Advantages:** Explicit content placement, spanning control, predictable breaks

**Option B: CSS Multi-Column**
```css
.cheatsheet-container {
  column-count: 4;
  column-gap: 1rem;
  column-fill: balance;
}
```

**Advantages:** Simpler implementation, automatic flow

**Recommendation:** Grid for precise control; Multi-column for rapid prototyping.

### Print Optimization

```css
@media print {
  @page {
    size: landscape;
    margin: 0.5in;
  }
  
  body {
    /* Ensure content fits single page */
  }
}
```

### File Structure

```
/cheatsheets/
├── cheatsheet.css              # Global stylesheet
├── [subject]-frozen.css        # Frozen overrides (as needed)
├── [subject].md                # Source content
├── [subject].html              # Generated output
├── converter.html              # Markdown to HTML tool
└── README.md                   # Usage documentation
```

---

## User Workflows

### Workflow 1: Create New Cheat Sheet

1. Write content in `[subject].md`
2. Open `converter.html` in browser
3. Load markdown file
4. Generate HTML
5. Save as `[subject].html`
6. Sheet automatically uses `cheatsheet.css`

### Workflow 2: Iterate on Global Styles

1. Edit `cheatsheet.css`
2. Refresh any unfrozen HTML file in browser
3. Changes immediately visible across all unfrozen sheets

### Workflow 3: Freeze Subject Styles

1. Identify elements to lock (e.g., color scheme, specific sections)
2. Copy relevant CSS rules from `cheatsheet.css` to new `[subject]-frozen.css`
3. Modify frozen rules as needed
4. Add frozen stylesheet link to `[subject].html`:
   ```html
   <link rel="stylesheet" href="[subject]-frozen.css">
   ```
5. Subject now immune to those specific global changes

### Workflow 4: Update Content

1. Edit `[subject].md`
2. Regenerate HTML via converter
3. Styling automatically applied (global + frozen if applicable)

---

## Design Considerations

### Visual Learning Optimization

**High Priority Elements:**
- Strong visual hierarchy (headings, weight, spacing)
- Color coding for different information types
- Adequate whitespace to reduce cognitive load
- Scannable structure (short paragraphs, clear labels)

**Recommended Visual Patterns:**
- Syntax examples in monospace with subtle background
- Key concepts in bold or colored callouts
- Command patterns in distinct visual blocks
- Cross-references with consistent iconography

### Maintainability

**Key Principles:**
- Markdown remains single source of truth
- CSS changes propagate automatically unless frozen
- No duplication of content across formats
- Freezing is additive, not destructive

---

## Development Phases

### Phase 1: MVP
- Single global stylesheet with 4-column grid layout
- Browser-based markdown converter
- Template HTML structure
- One example cheat sheet (Python recommended)

**Deliverables:**
- `cheatsheet.css` with print-optimized 4-column layout
- `converter.html` with marked.js integration
- `python.md` example content
- `python.html` generated output
- `README.md` with usage instructions

### Phase 2: Frozen Styles
- Implement cascade pattern for style freezing
- Create first frozen stylesheet (Python)
- Document freezing workflow

**Deliverables:**
- `python-frozen.css` with example overrides
- Updated `python.html` with dual stylesheet links
- Freezing workflow documentation

### Phase 3: Enhancement
- Refine visual design based on learning effectiveness
- Add semantic HTML structure for better AI parsing
- Optimize print layout for different paper sizes

---

## Success Criteria

1. **Content Creation:** New cheat sheet created in <15 minutes
2. **Style Iteration:** CSS changes visible in <10 seconds
3. **Freezing:** Subject styles locked with single file addition
4. **Print Quality:** Single-page landscape output, readable at arm's length
5. **AI Compatibility:** Markdown parseable by LLMs without preprocessing

---

## Open Questions

1. Should converter auto-save or require manual save?
2. Preferred markdown flavor (CommonMark, GFM)?
3. Should frozen CSS be complete copy or minimal overrides?
4. Version control strategy for stylesheets?

---

## Appendix: Example Markdown Structure

```markdown
# Python Quick Reference

## Data Types

### Strings
- Creation: `str = "hello"`
- Methods: `.upper()`, `.lower()`, `.strip()`

### Lists
- Creation: `lst = [1, 2, 3]`
- Methods: `.append()`, `.extend()`, `.pop()`

## Control Flow

### Conditionals
```python
if condition:
    pass
elif other:
    pass
else:
    pass
```

### Loops
```python
for item in iterable:
    pass

while condition:
    pass
```
```

This structure converts cleanly to semantic HTML and allows flexible grid placement.
