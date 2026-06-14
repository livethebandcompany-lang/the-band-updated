const fs = require('fs');
try {
  const content = fs.readFileSync('C:\\Users\\vedan\\.gemini\\config\\mcp_config.json', 'utf8');
  console.log(content);
} catch (err) {
  console.error(err);
}
