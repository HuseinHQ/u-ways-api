module.exports = {
  development: {
    username: process.env.POSTGRESDB_USER,
    password: process.env.POSTGRESDB_ROOT_PASSWORD,
    database: process.env.POSTGRESDB_DATABASE,
    host: 'postgresdb',
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
    username: 'postgres',
    password: 'postgres',
    database: 'uways_db',
    host: '54.151.218.21',
    dialect: 'postgres',
  },
};
