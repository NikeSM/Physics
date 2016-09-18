'use strict';

let chapters = require('./chapters');
let finish = require('./finish');

module.exports = (physics, physics_old) => {
  physics_old.select().table('book').then((data) => {
    let sum = 1;
    data.map((row) => {
      physics('books').insert({
        id: row.book_id,
        number: row.book_number,
        name: row.book_name
      }).then(
        () =>  sum = finish(sum, data.length,() => chapters(physics, physics_old), 'books finish')
      )
    });
  });
};
