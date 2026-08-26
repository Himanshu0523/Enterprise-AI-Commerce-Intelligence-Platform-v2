const mongoose = require('mongoose');
const redis = require('redis');
const { Client } = require('pg');
const https = require('https');

async function testAll() {
  console.log('==================================================');
  console.log(' 🔍 TESTING FREE-TIER CLOUD SERVICE CONNECTIONS');
  console.log('==================================================\n');
  
  // 1. MongoDB Atlas
  try {
    const mongoUri = 'mongodb+srv://himanshusatpute7_db_user:nlbSoWfpZq2HvsCt@cluster0.13m5yzl.mongodb.net/ecommerce_test?retryWrites=true&w=majority';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 6000 });
    console.log('✅ MongoDB Atlas (MongoDB):      CONNECTED SUCCESSFULLY');
    await mongoose.disconnect();
  } catch (err) {
    console.log('❌ MongoDB Atlas:                FAILED ->', err.message);
  }

  // 2. Upstash Redis
  try {
    const redisClient = redis.createClient({ 
      url: 'redis://default:6wggg262JxzI4YOxD2dzbGxYS9nEMULJ@start-unmistakable-turn-71479.db.redis.io:16872', 
      socket: { connectTimeout: 6000 } 
    });
    redisClient.on('error', () => {});
    await redisClient.connect();
    const reply = await redisClient.ping();
    console.log('✅ Upstash Redis (Cache):        CONNECTED SUCCESSFULLY (PING -> ' + reply + ')');
    await redisClient.disconnect();
  } catch (err) {
    console.log('❌ Upstash Redis:                FAILED ->', err.message);
  }

  // 3. Supabase PostgreSQL
  try {
    const pgClient = new Client({ 
      connectionString: 'postgresql://postgres:%3F%5EDZrzDw.42wXQ-@db.ynpulugagygalpkpepsv.supabase.co:5432/postgres', 
      connectionTimeoutMillis: 6000 
    });
    await pgClient.connect();
    const res = await pgClient.query('SELECT NOW()');
    console.log('✅ Supabase PostgreSQL (SQL):    CONNECTED SUCCESSFULLY');
    await pgClient.end();
  } catch (err) {
    console.log('❌ Supabase PostgreSQL:          FAILED ->', err.message);
  }

  // 4. Qdrant Cloud (Vector DB)
  try {
    const qdrantUrl = 'https://2f7b78c2-be5a-424b-9103-0adfa8ae1e83.sa-east-1-0.aws.cloud.qdrant.io/collections';
    const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIiwic3ViamVjdCI6ImFwaS1rZXk6MWJlMWQ2ZDUtMTNlZS00NjNkLTljZGUtMDJkNDUyMTMyZWNiIn0.Ief67838-2HW947FbhS66fBEivtZEElnMY2ZEpj8xzQ';
    
    await new Promise((resolve, reject) => {
      const req = https.get(qdrantUrl, { headers: { 'api-key': apiKey } }, (res) => {
        if (res.statusCode === 200) {
          console.log('✅ Qdrant Cloud (Vector DB):     CONNECTED SUCCESSFULLY (HTTP 200)');
          resolve();
        } else {
          reject(new Error(`HTTP status ${res.statusCode}`));
        }
      });
      req.on('error', reject);
      req.setTimeout(6000, () => { req.destroy(); reject(new Error('Timeout')); });
    });
  } catch (err) {
    console.log('❌ Qdrant Cloud:                 FAILED ->', err.message);
  }

  console.log('\n==================================================');
  process.exit(0);
}

testAll();
