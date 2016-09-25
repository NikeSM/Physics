'use strict';

let dbConnections = require('./../db-connection');
let settings = require('../settings');
let books = require('./books');
let images = require('./images');
let prompts = require('./prompts');

let physics_old = dbConnections(settings.devDataBase);

let physics = dbConnections(settings.localDataBase);

function migration(physics, physics_old) {
  books(physics, physics_old);
  images(physics, physics_old);
  prompts(physics, physics_old);
}

migration(physics, physics_old);