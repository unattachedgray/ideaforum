const path = require('path');

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'idea_forum',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: path.join(__dirname, '../database/migrations'),
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: path.join(__dirname, '../database/seeds')
    }
  },

  test: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'idea_forum_test',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    },
    pool: {
      min: 1,
      max: 5
    },
    migrations: {
      directory: path.join(__dirname, '../database/migrations'),
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: path.join(__dirname, '../database/seeds')
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL || {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 20
    },
    migrations: {
      directory: path.join(__dirname, '../database/migrations'),
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: path.join(__dirname, '../database/seeds')
    },
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  }
};
