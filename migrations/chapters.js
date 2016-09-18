'use strict';

let paragraphs = require('./paragraphs');
let finish = require('./finish');

module.exports = (physics, physics_old) => {
  physics_old.select().table('chapter').then((data) => {
    let sum = 1;
    data.map((row) => {
      physics('chapters').insert({
        id: row.chapter_id,
        number: row.chapter_number,
        name: row.chapter_name,
        book_id: row.book_id
      }).then(
        () =>  sum = finish(sum, data.length,() => paragraphs(physics, physics_old), 'chapters finish')
      )
    });
  });
};
