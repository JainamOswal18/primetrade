import { Sequelize } from 'sequelize';
import path from 'path';
import fs from 'fs';

// Ensure data folder exists
const dbPath = path.resolve(process.cwd(), 'data/database.sqlite');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false, // Set to console.log to see SQL queries
    retry: {
        match: [/SQLITE_BUSY/],
        name: 'query',
        max: 5
    }
});

const configureSQLite = async () => {
    // Critical Pragmas for Concurrency
    await sequelize.query('PRAGMA journal_mode = WAL;');
    await sequelize.query('PRAGMA synchronous = NORMAL;');
    await sequelize.query('PRAGMA busy_timeout = 5000;'); // Wait 5s for lock
    await sequelize.query('PRAGMA cache_size = -2000;'); // ~2MB cache
};

export { sequelize, configureSQLite };
