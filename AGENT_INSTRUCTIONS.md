# Agent Instructions - Cheat Sheet System

This document provides instructions for AI agents (like Claude) to effectively work with the Cheat Sheet System.

## System Overview

The Cheat Sheet System is a markdown-to-HTML converter for creating print-optimized reference materials with:
- 4-column multi-column CSS layout
- Syntax highlighting via Prism.js
- Print optimization for landscape A4/Letter
- Top-to-bottom, left-to-right flow

## Project Structure

```
cheatsheets/
├── cheatsheets/           # All cheat sheet markdown and HTML files
│   ├── *.md              # Source markdown files
│   └── *.html            # Generated HTML files
├── styles/
│   └── cheatsheet.css    # Global stylesheet (DO NOT modify without explicit request)
├── tools/
│   ├── converter.html    # Browser-based converter
│   └── generate.js       # CLI generation script
├── docs/
│   └── prd.md           # Product requirements document
├── README.md            # User-facing documentation
└── AGENT_INSTRUCTIONS.md # This file
```

## Common Tasks

### 1. Creating a New Cheat Sheet

**User Request Examples:**
- "Create a cheat sheet for [topic]"
- "Make a reference for [technology]"
- "Add [language] to the cheat sheets"

**Steps:**

1. **Create markdown file** in `cheatsheets/[topic].md`
   - Use lowercase with hyphens for filenames (e.g., `javascript.md`, `git-commands.md`)
   - Follow the markdown structure guidelines below

2. **Generate HTML**:
   ```bash
   node tools/generate.js [topic]
   ```

3. **Verify output**:
   ```bash
   open cheatsheets/[topic].html
   ```

**Important:**
- Always create markdown in `cheatsheets/` directory
- Generated HTML goes in `cheatsheets/` directory
- Use the CLI generator for consistency
- Test the output visually

### 2. Updating an Existing Cheat Sheet

**User Request Examples:**
- "Update the Python cheat sheet to include..."
- "Add a section about [topic] to [subject]"

**Steps:**

1. **Read current content**:
   ```bash
   Read cheatsheets/[subject].md
   ```

2. **Edit markdown file** using the Edit tool

3. **Regenerate HTML**:
   ```bash
   node tools/generate.js [subject]
   ```

4. **Verify changes**:
   ```bash
   open cheatsheets/[subject].html
   ```

### 3. Modifying Styles

**⚠️ Warning:** Only modify styles when explicitly requested by the user.

**User Request Examples:**
- "Change the H2 color to..."
- "Make code blocks smaller"
- "Adjust the column gap"

**Steps:**

1. **Read current CSS**:
   ```bash
   Read styles/cheatsheet.css
   ```

2. **Make targeted changes** using Edit tool
   - Be conservative with changes
   - Maintain print compatibility
   - Keep syntax highlighting overrides intact

3. **Test changes**:
   ```bash
   open cheatsheets/python.html  # Use any existing sheet for testing
   ```

4. **Explain impact** to user:
   - What changed
   - Which elements are affected
   - Any potential print issues

### 4. Adding Syntax Highlighting Languages

**User Request Examples:**
- "Add TypeScript syntax highlighting"
- "Support Rust code blocks"

**Steps:**

1. **Update generate.js** - Add Prism.js component:
   ```javascript
   <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-[language].min.js"></script>
   ```

2. **Update converter.html** - Add same component

3. **Test with example**:
   - Create a test markdown snippet with the language
   - Generate HTML
   - Verify highlighting works

## Markdown Structure Guidelines

### Best Practices for Cheat Sheets

1. **Hierarchy:**
   - H1: Main title (only one, spans all columns)
   - H2: Major sections (Data Types, Functions, etc.)
   - H3: Subsections (Strings, Lists, etc.)
   - H4: Minor headings (rarely needed)

2. **Content Density:**
   - Keep concise - aim for single-page print output
   - Use bullet points for quick reference
   - Include code examples for clarity
   - Avoid long paragraphs

3. **Code Blocks:**
   - Always specify language: \`\`\`python, \`\`\`javascript, \`\`\`bash
   - Keep examples short and focused
   - Include comments for clarity

4. **Inline Code:**
   - Use for commands, variables, function names
   - Example: `variable_name`, `.method()`, `command --flag`

### Template Structure

```markdown
# [Technology] Quick Reference

## Section 1

### Subsection 1.1
- Point 1: `example`
- Point 2: `another example`

### Subsection 1.2
\`\`\`[language]
code example
\`\`\`

## Section 2

### Subsection 2.1
Description with **bold** and *italic* emphasis.

\`\`\`[language]
more code
\`\`\`
```

## Important Constraints

### DO NOT:

1. **Modify global styles** without explicit user request
   - The CSS is carefully tuned for print
   - Changes affect ALL cheat sheets

2. **Change file paths** without updating references
   - HTML files reference `../styles/cheatsheet.css`
   - Tools reference `cheatsheets/` directory

3. **Remove syntax highlighting**
   - Keep all Prism.js includes
   - Maintain token color overrides in CSS

4. **Use grid instead of multi-column**
   - System specifically uses multi-column layout
   - Provides top-to-bottom flow that user requested

5. **Create files outside project structure**
   - Keep markdown in `cheatsheets/`
   - Keep tools in `tools/`
   - Keep styles in `styles/`

### DO:

1. **Test generated output**
   - Always open HTML after generation
   - Check for layout issues
   - Verify syntax highlighting works

2. **Follow naming conventions**
   - Lowercase with hyphens for filenames
   - Descriptive names (e.g., `git-commands.md`, not `gc.md`)

3. **Maintain consistency**
   - Use existing cheat sheets as reference
   - Follow established markdown patterns
   - Keep similar section structures

4. **Ask for clarification**
   - If user request is ambiguous about styling
   - If changes might affect print layout
   - If unsure about content organization

## Common Patterns

### Creating Subject Cheat Sheets

For programming languages, include:
- Installation/setup
- Data types
- Control flow
- Functions/methods
- Common operations
- Error handling
- Examples

For tools/frameworks, include:
- Installation
- Basic usage
- Configuration
- Common commands
- API reference
- Examples

### Content Organization

**Good organization:**
- Logical grouping by topic
- Progressive complexity
- Quick-reference friendly
- Scannable headings

**Poor organization:**
- Random order
- Too much nesting
- Long prose paragraphs
- Missing examples

## Troubleshooting

### User Reports Layout Issues

1. **Check markdown structure**
   - Verify heading hierarchy
   - Ensure code blocks are closed
   - Check for special characters

2. **Regenerate HTML**
   ```bash
   node tools/generate.js [subject]
   ```

3. **Test in browser**
   - Check console for errors
   - Verify CSS loaded
   - Test print preview

### Syntax Highlighting Not Working

1. **Verify language specification** in code blocks
2. **Check Prism.js includes** in generated HTML
3. **Test with different language**
4. **Check browser console** for errors

### Columns Not Balancing

1. **Check content amount** - may need more content
2. **Review break-inside rules** - sections staying together
3. **Test print preview** - screen vs print may differ

## CLI Commands Reference

```bash
# Generate single cheat sheet
node tools/generate.js [subject]

# Examples
node tools/generate.js python
node tools/generate.js fastapi
node tools/generate.js javascript

# Open converter in browser
open tools/converter.html

# Open generated cheat sheet
open cheatsheets/[subject].html

# Install dependencies (if needed)
npm install marked
```

## File Path Reference

When updating code that references files:

```javascript
// In generate.js (runs from project root)
markdown = fs.readFileSync(`cheatsheets/${filename}.md`, 'utf8');
fs.writeFileSync(`cheatsheets/${filename}.html`, fullHTML);

// In generated HTML (relative to cheatsheets/ directory)
<link rel="stylesheet" href="../styles/cheatsheet.css">

// In converter.html (relative to tools/ directory)
<link rel="stylesheet" href="../styles/cheatsheet.css">
```

## Response Guidelines

### When Creating Content

- **Be comprehensive but concise** - cheat sheets are quick references
- **Include practical examples** - users need working code
- **Organize logically** - most-used items first
- **Test before presenting** - verify HTML generation works

### When Explaining Changes

- **Show what changed** - specific before/after
- **Explain impact** - what this affects
- **Provide testing steps** - how to verify
- **Note any caveats** - print layout, browser compatibility

### When Troubleshooting

- **Diagnose systematically** - check files, paths, syntax
- **Test hypotheses** - regenerate, reload, inspect
- **Provide clear steps** - how to fix the issue
- **Prevent recurrence** - explain root cause

## Version Control

The system does not currently use git, but if the user initializes a repository:

**Include in commits:**
- `cheatsheets/*.md` (source files)
- `cheatsheets/*.html` (generated files)
- `styles/cheatsheet.css`
- `tools/*`
- `README.md`
- `AGENT_INSTRUCTIONS.md`

**Exclude from commits:**
- `node_modules/`
- `.DS_Store`
- Temporary files

## Summary

**Key Principles:**
1. Markdown in `cheatsheets/`, tools in `tools/`, styles in `styles/`
2. Use CLI generator for consistency
3. Test output visually
4. Don't modify styles without explicit request
5. Follow established patterns
6. Keep content concise and scannable
7. Always specify language in code blocks
8. Maintain multi-column layout system

**When in doubt:**
- Read existing cheat sheets as examples
- Check README.md for user documentation
- Ask user for clarification on ambiguous requests
- Test changes before confirming completion
