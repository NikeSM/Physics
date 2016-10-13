'use strict';

let problems = require('./problems');
let finish = require('./finish');

module.exports = (physics, physics_old) => {
  physics_old.select().table('paragraph').then((data) => {
    let sum = 1;
    data.map((row) => {
      physics('paragraphs').insert({
        id: row.paragraph_id,
        number: row.paragraph_number,
        name: row.paragraph_name,
        content: row.paragraph_content,
        rendered: row.paragraph_tmp,
        chapter_id: row.chapter_id
      }).then(
        () =>  sum = finish(sum, data.length,() => problems(physics, physics_old), 'paragraphs finish')
      );
      row.paragraph_keys = row.paragraph_keys || '';

      row.paragraph_keys.split('$').map((keyword) => {
        if (keyword) {
          physics('keywords').insert({
            keyword: keyword,
            type: 'paragraph',
            ref_id: row.paragraph_id
          }).then();
        }
      });
      row.paragraph_pos = row.paragraph_pos || '';
      row.paragraph_pos.split(',').map((pos) => {
        pos = pos.trim();
        if (pos && +pos) {
          physics('pos').insert({
            pos: pos,
            type: 'problem',
            ref_id: row.paragraph_id
          }).then();
        }
      });
    });
  });
};
