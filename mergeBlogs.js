const fs = require('fs');

try {
    const orig = fs.readFileSync('src/data/blogData.ts', 'utf8');
    const newFile = fs.readFileSync('C:\\tmp\\updated_blogData.ts', 'utf8');

    const targetChunk = '    ...Array.from({ length: 8 })';
    const targetIndex = orig.indexOf(targetChunk);

    if (targetIndex === -1) {
        console.log("Could not find demo blog section. Aborting.");
        process.exit(1);
    }

    let origKeep = orig.substring(0, targetIndex);
    if (!origKeep.endsWith(',')) {
        origKeep = origKeep.trimEnd();
        if (!origKeep.endsWith(',')) {
            origKeep += ',';
        }
    }
    origKeep += '\n';

    // Get the objects block from new file
    const startObjIndex = newFile.indexOf('    {\n');
    const endObjIndex = newFile.lastIndexOf('    }\n');

    if (startObjIndex === -1 || endObjIndex === -1) {
        console.log("Could not extract new blogs. Aborting.");
        process.exit(1);
    }

    let newBlogsText = newFile.substring(startObjIndex, endObjIndex + 5);

    // Replace IDs 1 to 10 with 13 to 22.
    // The pattern is: `        id: X,`
    let nextId = 13;
    newBlogsText = newBlogsText.replace(/\s+id:\s+\d+,/g, () => {
        return `        id: ${nextId++},`;
    });

    const finalCode = origKeep + newBlogsText + '\n];\n';
    fs.writeFileSync('src/data/blogData.ts', finalCode);
    console.log("Successfully appended new blogs replacing demo posts.");
} catch (e) {
    console.error(e);
    process.exit(1);
}
