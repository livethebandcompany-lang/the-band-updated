const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:\\Users\\vedan\\.gemini\\antigravity\\brain\\30b7c879-f052-4ce1-a120-edcafc089115\\.system_generated\\logs\\transcript.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (line.includes('generate_image') || line.includes('ServerName') || line.includes('mcp')) {
      console.log(line);
    }
  }
}

processLineByLine();
