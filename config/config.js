module.exports = {
  development: {
    username: 'postgres',
    password: 'postgres',
    database: 'uways_db_dev',
    host: 'localhost',
    dialect: 'postgres',
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: process.env.POSTGRESDB_USER,
    password: process.env.POSTGRESDB_ROOT_PASSWORD,
    database: process.env.POSTGRESDB_DATABASE,
    host: 'postgresdb',
    dialect: 'postgres',
  },
};
