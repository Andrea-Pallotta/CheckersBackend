const DB = require('better-sqlite3-helper');

DB({
  path: './database/connect4.db',
  readonly: false,
  fileMustExist: false,
  WAL: true,
  migrate: {
    force: false,
    table: 'migration',
    migrationsPath: './migrations',
  },
});
