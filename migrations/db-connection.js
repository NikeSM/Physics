'use strict';

let knex = require('knex');

module.exports = (options) => {
  return knex({
    client: 'mysql',
    connection: {
      host     : options.HOST,
      user     : options.USER,
      password : options.PASSWORD,
      database : options.DATABASE,
      insecureAuth: true
    }
  });
};
