const fs = require('fs');
const { marked } = require('marked');

// Get filename from command line or use default
const filename = process.argv[2] || 'python';

// Read the markdown file from cheatsheets directory
const markdown = fs.readFileSync(`cheatsheets/${filename}.md`, 'utf8');

// Convert to HTML
const htmlContent = marked.parse(markdown);

// Create title from filename
const title = filename.charAt(0).toUpperCase() + filename.slice(1) + ' Cheat Sheet';

// Create full HTML document
const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="../styles/cheatsheet.css">
  <!-- Prism.js for syntax highlighting -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css">
</head>
<body>
  <div class="cheatsheet-container">
${htmlContent}
  </div>

  <!-- Prism.js -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-bash.min.js"></script>
</body>
</html>`;

// Write the HTML file to cheatsheets directory
fs.writeFileSync(`cheatsheets/${filename}.html`, fullHTML);
console.log(`Generated cheatsheets/${filename}.html`);
