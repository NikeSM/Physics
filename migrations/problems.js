'use strict';

let finish = require('./finish');

module.exports = (physics, physics_old) => {
  physics_old.select().table('problem').then((data) => {
    let sum = 1;
    data.map((row) => {
      physics('problems').insert({
        id: row.problem_id,
        number: row.problem_number,
        name: row.problem_name,
        content: row.problem_content,
        rendered: row.problem_tmp,
        paragraph_id: row.paragraph_id
      }).then(
        () =>  sum = finish(sum, data.length, () => {}, 'problems finish')
      );
      row.problem_keys = row.problem_keys || '';
      row.problem_keys.split('$').map((keyword) => {
        if (keyword) {
          physics('keywords').insert({
            keyword: keyword,
            type: 'problem',
            ref_id: row.problem_id
          }).then();
        }
      });
      row.problem_pos = row.problem_pos || '';
      row.problem_pos.split(',').map((pos) => {
        pos = pos.trim();
        if (pos && +pos) {
          physics('pos').insert({
            pos: pos,
            type: 'pos',
            ref_id: row.problem_id
          }).then();
        }
      });
    });
  });
};
