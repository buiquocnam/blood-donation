const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Database configuration
const sequelize = new Sequelize(
  process.env.DB_NAME || 'dbHIENMAU',
  process.env.DB_USER || 'sa',
  process.env.DB_PASSWORD || 'abc123456',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mssql',
    port: process.env.DB_PORT || 1433,
    dialectOptions: {
      options: {
        encrypt: true,
        trustServerCertificate: true, // For local dev environment
      },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: process.env.NODE_ENV !== 'production',
  }
);

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = {
  sequelize,
  testConnection,
}; 