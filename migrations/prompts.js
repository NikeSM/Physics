'use strict';

let finish = require('./finish');

module.exports = (physics, physics_old) => {
  physics_old.select().table('prompt').then((data) => {
    let sum = 1;
    data.map((row) => {
      physics('prompts').insert({
        id: row.prompt_id,
        name: row.prompt_name,
        content: row.prompt_content,
        rendered: row.prompt_tmp
      }).then(
        () =>  sum = finish(sum, data.length, () => {}, 'prompts finish')
      );
    });
  });
};
