const { MongoClient } = require('mongodb');

async function testUri(uri, name) {
  const client = new MongoClient(uri, { connectTimeoutMS: 5000 });
  try {
    await client.connect();
    console.log(`[PASS] ${name}: Connected!`);
    return true;
  } catch (err) {
    console.log(`[FAIL] ${name}: ${err.message}`);
    return false;
  } finally {
    await client.close();
  }
}

async function run() {
  const variations = [
    {
      name: 'User provided (Original with typo)',
      uri: 'mongodb+srv://livethebandcompany_db_user:samad@1999@thebandcomapny.qoghsqo.mongodb.net/?appName=TheBandComapny'
    },
    {
      name: 'User provided (Encoded password)',
      uri: 'mongodb+srv://livethebandcompany_db_user:samad%401999@thebandcomapny.qoghsqo.mongodb.net/?appName=TheBandComapny'
    },
    {
      name: 'Corrected "company" spelling',
      uri: 'mongodb+srv://livethebandcompany_db_user:samad@1999@thebandcompany.qoghsqo.mongodb.net/?appName=TheBandCompany'
    },
    {
      name: 'Corrected "company" spelling (Encoded password)',
      uri: 'mongodb+srv://livethebandcompany_db_user:samad%401999@thebandcompany.qoghsqo.mongodb.net/?appName=TheBandCompany'
    }
  ];

  for (const v of variations) {
    if (await testUri(v.uri, v.name)) break;
  }
}

run();
