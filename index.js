'use strict';
let express = require('express');
let app = express();

app.use(express.static('static'));
let dbConnections = require('./db-connection');
let _templates = __dirname + '/static/templates';

let settings = require('./settings');

let physics = dbConnections(settings.localDataBase);




app.get('/sitemap.xml', (req, res) => { res.sendfile(__dirname + '/static/sitemap.xml')});
app.get('/robots.txt', (req, res) => { res.sendfile(__dirname + '/static/robots.txt')});
app.get('/favicon.ico', (req, res) => { res.sendfile(__dirname + '/static/favicon.ico')});


app.get('/helper:name',(req, res) => {res.sendfile(__dirname + '/static/helpers/' + req.params.name)});

app.get('/', (req, res) => {
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

});

app.get('/getHome', (req, res) => { res.sendfile(_templates + '/home/index.html')});
app.get('/getError', (req, res) => { res.sendfile(_templates + '/error/index.html')});
app.get('/getHelp', (req, res) => { res.sendfile(_templates + '/help/index.html')});

app.use((req, res) => {
  res.status(404).sendfile(_templates + '/error/index.html');
});

app.listen(3000);


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