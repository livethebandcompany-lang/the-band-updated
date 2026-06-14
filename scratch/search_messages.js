const fs = require('fs');
const path = require('path');

const messagesDir = 'C:\\Users\\vedan\\.gemini\\antigravity\\brain\\30b7c879-f052-4ce1-a120-edcafc089115\\.system_generated\\messages';
const files = fs.readdirSync(messagesDir);

files.forEach(file => {
    if (file.endsWith('.json')) {
        const filePath = path.join(messagesDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('generate_image') || content.includes('lonavala_live_band')) {
            console.log(`=== FILE: ${file} ===`);
            console.log(content.substring(0, 1000));
        }
    }
});
