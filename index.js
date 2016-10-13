'use strict';
let express = require('express');
let app = express();

app.use(express.static('static'));
let dbConnections = require('./db-connection');
let _templates = __dirname + '/static/templates';

let settings = require('./settings');

let physics = dbConnections(settings.localDataBase);

app.get('/', parseRoot);
app.get('/tableOfContent', getTableofContent);
app.get('/sitemap.xml', (req, res) => res.sendfile(__dirname + '/static/sitemap.xml'));
app.get('/robots.txt', (req, res) => res.sendfile(__dirname + '/static/robots.txt'));
app.get('/favicon.ico', (req, res) => res.sendfile(__dirname + '/static/favicon.ico'));
app.get('/helper:name',(req, res) => res.sendfile(__dirname + '/static/helpers/' + req.params.name));
app.get('/getHome', (req, res) => res.sendfile(_templates + '/home/index.html'));
app.get('/getError', (req, res) => res.sendfile(_templates + '/error/index.html'));
app.get('/getHelp', (req, res) => res.sendfile(_templates + '/help/index.html'));
app.get('/showProblem', (res, req) => show(res, req, 'problems'));
app.get('/showParagraph', (res, req) => show(res, req, 'paragraphs'));
app.get('/showProblem', (res, req) => show(res, req, 'problems'));
app.get('/showPrompt', (res, req) => show(res, req, 'prompts'));
app.use((req, res) => res.status(404).sendfile(_templates + '/error/index.html'));
app.get('/search', search);

app.listen(3000);


function parseRoot(req, res) {
  let parsedFragment = parseFragment(req.query['_escaped_fragment_']);
  switch (parsedFragment.type) {
    case 'help':
      res.set('Last-Modified', getLastModify());
      res.set('Expires', getExpires());
      res.sendFile(_templates + '/help/index.html');
      break;
    case 'paragraphID':
      physics('paragraphs').where('id', parsedFragment.id).select('content', 'timestamp').then((result) => {
        res.set('Last-Modified', getLastModify(result[0].timestamp));
        res.set('Expires', getExpires(result[0].timestamp));
        res.send(result[0].content)
      });
      break;
    case 'problemID':
      physics('problems').where('id', parsedFragment.id).select('content', 'timestamp').then((result) => {
        res.set('Last-Modified', getLastModify(result[0].timestamp));
        res.set('Expires', getExpires(result[0].timestamp));
        res.send(result[0].content)
      });
      break;
    default:
      res.set('Last-Modified', getLastModify());
      res.set('Expires', getExpires());
      res.sendFile(_templates + '/home/index.html');
      break;
  }
}

function secureQuery(text) {
  return text.trim().toLowerCase()
  .replace(/[^a-z0-9а-я\- ]/g, ' ')
  .replace(/\s+/g, ' ');
}

function getTableofContent(req, res) {
  Promise.all(
    [physics.select('id', 'name', 'number').from('books'),
      physics.select('id', 'name', 'number', 'book_id').from('chapters'),
      physics.select('id', 'name', 'number', 'chapter_id').from('paragraphs'),
      physics.select('id', 'name', 'number', 'paragraph_id').from('problems'),
      physics.select('id', 'name').from('prompts'),
      physics.select('pos', 'type', 'ref_id').from('pos')]
  ).then((data) => {
    let result = {
      books: data[0],
      chapters: data[1],
      paragraphs: data[2],
      problems: data[3],
      prompts: data[4]
    };
    result.paragraphs.map((paragraph) => {
      paragraph.pos = data[5].filter(
        (pos) => pos.type === 'paragraph' && pos.ref_id === paragraph.id)
    });
    result.problems.map((problem) => {
      problem.pos = data[5].filter(
        (pos) => pos.type === 'problem' && pos.ref_id === problem.id)
    });
    res.send(result);
  });
}

function parseFragment(fragment) {
  let regExp = /(\D*)(\d*)/;
  let match = regExp.exec(fragment);
  let parsedFragment = {
    type: '',
    id: 0
  };
  if (match) {
    parsedFragment.type =  match[1] || '';
    parsedFragment.id =  match[2] || 0;
  }
  return parsedFragment
}

function getExpires(date) {
  date = date ? new Date(date) : new Date();
  date.setMonth(date.getMonth() + 1);
    return date.toUTCString()
}

function getLastModify(date) {
  date = date ? new Date(date) : new Date();
  return date.toUTCString()
}

function show(res, req, table) {
  let id = req.query.id;
  physics(table).where('id', id).select('content', 'rendered', 'timestamp').then((result) => {
    res.set('Last-Modified', getLastModify(result[0].timestamp));
    res.set('Expires', getExpires(result[0].timestamp));
    res.send(result[0].content);
  });
}

function getScore(word, words) {
  let goodWords = ['тело', 'тела', 'телу', 'телом', 'теле',
    'Точка', 'точки', 'точке', 'точкой',
    'сила', 'силы', 'силой', 'силе',
    'закон', 'закона', 'закону', 'законом', 'законе',
    'скорость', 'скорости', 'скоростью',
    'ускорение', 'ускорения', 'ускорением', 'ускорению', 'ускорении',
    'перемещение', 'перемещения', 'перемещением', 'перемещению',
    'направление', 'направления', 'направлением', 'направлению', 'направления',
    'путь', 'пути', 'путем',
    'нормальный', 'нормальное', 'нормального', 'нормальному',
    'действие', 'действия', 'действием', 'действии', 'действию',
    'движение', 'движения', 'движению', 'движением', 'движении',
    'вес', 'веса', 'весом', 'весе',
    'работа', 'работы', 'работой', 'работе',
    'вращение', 'вращения', 'вращением', 'вращению', 'вращении',
    'колебания', 'колебаний', 'колебаниями', 'колебаниях',
    'идеальный', 'идеального', 'идеальному', 'идеальном',
    'состояние', 'состояния', 'состоянием', 'состоянии'];

  return goodWords.indexOf(word) > -1 ? -2 :
    words.length > 1 ? 1 : -1;
}

function search(req, res) {
  let query = req.query.request;
  query = secureQuery(req);
  let time = getLastModify();
  physics('search').insert({time: time, request: query}).then();
  let promises = [];
  let result = [];
  promises.push(physics('keywords').select('ref_id', 'type').where('keyword', 'like', query));
  let words = query.split(' ');
  words.map((word) =>
    promises.push(physics('keywords').select('ref_id', 'type').where('keyword', 'like', '%' + word + '%')));

  Promise.all(promises).then((data) => {
    result.concat(
      data.shift().map(row => row.score = 10)
    );
    data.map((wordResult, i) => {
      result.concat(wordResult.map((row) => row.score = getScore(words[i])))
    });

    result.reduce((acc, cur) => {
      let similar = acc.filter((pushed) => pushed.type === cur.type && pushed.id === cur.id)[0];
      if (similar) {
        similar.score = similar.score + cur.score
      } else {
        acc.push(cur)
      }
      return acc;
    }, []);
    res.send(result);
  })

}
