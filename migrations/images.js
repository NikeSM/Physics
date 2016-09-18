'use strict';

let finish = require('./finish');
let fs = require('fs');

module.exports = (physics, physics_old) => {
  physics_old.select().table('image').then((data) => {
    data.map((row, i) => {
      fs.writeFile('./migrations/images/' + row.image_name, row.image, (e) => console.log(e));
      finish(i + 1, data.length, () => {
      }, 'images finish');
    });
  });
};
