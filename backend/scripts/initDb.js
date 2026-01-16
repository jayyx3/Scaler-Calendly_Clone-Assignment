const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function initDb() {
  console.log('Connecting to MySQL...');
  // Connect without database selected to create it (unless in cloud)
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
    ssl: {
      rejectUnauthorized: false
    }
  };

  if (process.env.DB_HOST && process.env.DB_HOST !== 'localhost') {
    dbConfig.database = process.env.DB_NAME || 'test';
  }

  const connection = await mysql.createConnection(dbConfig);

  try {
    console.log('Connected to MySQL server successfully.');

    const schemaPath = path.join(__dirname, '../config/schema.sql');
    let schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // For Cloud databases, we often cannot create new databases.
    // If DB_HOST is set (implying cloud/remote), we filter out CREATE DATABASE and USE commands
    // to ensure we use the pre-configured database from the connection.
    if (process.env.DB_HOST && process.env.DB_HOST !== 'localhost') {
      console.log('Cloud environment detected. modifying schema to use existing database...');
      schemaSql = schemaSql
        .replace(/CREATE DATABASE IF NOT EXISTS \w+;/g, '')
        .replace(/USE \w+;/g, '');
    }

    console.log('Executing schema.sql...');
    // schema.sql contains CREATE DATABASE and USE statements
    await connection.query(schemaSql);
    
    console.log('Database calendly_clone created and seeded successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await connection.end();
  }
}

initDb();
