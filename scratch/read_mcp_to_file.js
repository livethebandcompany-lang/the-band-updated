const fs = require('fs');
try {
  const content = fs.readFileSync('C:\\Users\\vedan\\.gemini\\config\\mcp_config.json', 'utf8');
  fs.writeFileSync('scratch/mcp_config.txt', content);
  console.log("Success");
} catch (err) {
  fs.writeFileSync('scratch/mcp_config.txt', err.stack);
  console.error(err);
}
