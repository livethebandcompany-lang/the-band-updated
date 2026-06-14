const pngToIco = require('png-to-ico');
const fs = require('fs');
const path = require('path');

async function generateIco() {
  try {
    const pngPath = path.join(__dirname, 'public', 'favicon-32x32.png');
    
    if (!fs.existsSync(pngPath)) {
      console.error('Source PNG not found at:', pngPath);
      return;
    }

    const buf = await pngToIco(pngPath);

    const publicIcoPath = path.join(__dirname, 'public', 'favicon.ico');
    fs.writeFileSync(publicIcoPath, buf);
    console.log('Updated public/favicon.ico');

    const appIcoPath = path.join(__dirname, 'src', 'app', 'favicon.ico');
    if (fs.existsSync(appIcoPath)) {
      fs.writeFileSync(appIcoPath, buf);
      console.log('Updated src/app/favicon.ico');
    } else {
      console.log('src/app/favicon.ico not found, skipping.');
    }

  } catch (err) {
    console.error('Error generating ICO:', err);
  }
}

generateIco();
