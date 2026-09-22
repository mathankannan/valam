import fs from 'fs';
import path from 'path';

const sqlDir = path.join(process.cwd(), 'sql');
const outFile = path.join(process.cwd(), 'postgresql_init.sql');

const schemas = `
CREATE TABLE IF NOT EXISTS "VALAM_REGISTER_TABLE" (
    "register_id" SERIAL PRIMARY KEY,
    "user_name" VARCHAR(255) NOT NULL,
    "user_password" VARCHAR(255) NOT NULL,
    "created_date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Orders" (
    "id" SERIAL PRIMARY KEY,
    "order_number" VARCHAR(255),
    "items" TEXT,
    "name" VARCHAR(255),
    "mobile" VARCHAR(20),
    "address" TEXT,
    "city" VARCHAR(100),
    "pincode" VARCHAR(20),
    "Order_status" VARCHAR(50),
    "created_date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "VALAM_MENU" (
    "menu_id" SERIAL PRIMARY KEY,
    "menu_name" VARCHAR(255),
    "status" VARCHAR(50),
    "created_date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "VALAM_COMBO_OFFER_TABLE" (
    "combo_offer_id" SERIAL PRIMARY KEY,
    "combo_offer_name" VARCHAR(255),
    "combo_offer_amount" DECIMAL(10,2),
    "combo_offer_image" VARCHAR(255),
    "combo_items_text" TEXT,
    "status" VARCHAR(50) DEFAULT 'Active',
    "created_date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "VALAM_SUBSCRIBE_TABLE" (
    "Subscribe_id" SERIAL PRIMARY KEY,
    "email_id" VARCHAR(255) UNIQUE,
    "created_date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "VALAM_CONTENT_TABLE" (
    "content_id" SERIAL PRIMARY KEY,
    "menu_id" INT,
    "menu_name" VARCHAR(255),
    "menu_name_tamil" VARCHAR(255),
    "amount" DECIMAL(10,2),
    "image" VARCHAR(255),
    "content_text_english" TEXT,
    "content_text_tamil" TEXT,
    "ingredients_text_english" TEXT,
    "ingredients_text_tamil" TEXT,
    "net_weight" VARCHAR(100),
    "shelf_life" VARCHAR(100),
    "created_date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP,
    "created_by" VARCHAR(255)
);

`;

let outputSql = schemas;

const files = fs.readdirSync(sqlDir).filter(f => f.endsWith('.sql'));

for (const file of files) {
    const tableName = path.parse(file).name;
    const content = fs.readFileSync(path.join(sqlDir, file), 'utf8');
    
    // Process each line to fix MySQL specific syntax
    const lines = content.split('\n');
    for (let line of lines) {
        if (line.trim().startsWith('INSERT INTO')) {
            // Replace empty backticks with "TableName"
            line = line.replace(/INSERT INTO ``/, `INSERT INTO "${tableName}"`);
            
            // Replace all other backticks with double quotes for PostgreSQL identifiers
            line = line.replace(/`/g, '"');
            
            // In PostgreSQL, string escapes with \' work in some contexts, but standard is '' 
            // We'll leave it as is for now since pg usually handles standard inserts if standard_conforming_strings is off or it's standard syntax.
            // But \' should be '' in pure Postgres. Let's fix that too.
            line = line.replace(/\\'/g, "''");
            
            outputSql += line + '\n';
        }
    }
}

fs.writeFileSync(outFile, outputSql);
console.log('Converted SQL written to postgresql_init.sql');
