const URL = 'http://123physics.ru';
const chai = require('chai');
const expect = chai.expect;
const fs = require('fs');

const path = (...args) => [URL].concat(args).join('/');

chai.use(require('chai-http'));
chai.use(require('chai-things'));

describe('Check existing API', () => {

    const API = chai.request(URL);

    it('GET robots.txt', () => {
        return chai
            .request(URL)
            .get('/robots.txt')
            .then(res => expect(res).to.be.text);
    });
    it('GET sitemap.xml', () => {
        return chai
            .request(URL)
            .get('/sitemap.xml')
            .then(res => expect(res).to.be.xml);
    });
    it('GET favicon.ico', () => {
        return chai
            .request(URL)
            .get('/favicon.ico')
            .then(res => expect(res).to.have.header('content-type', 'image/x-icon'));
    });

    it('GET /', () => {
        return chai
            .request(URL)
            .get('/')
            .then(res => expect(res).to.be.html || res);
    });
    it('GET / with _escaped_fragment_', () => {
        return chai
            .request(URL)
            .get('/')
            .query({ _escaped_fragment_: 'paragraphID19' })
            .then(res => expect(res).to.be.html || res)
            .then(res => expect(res).to.have.header('last-modified') || res)
            .then(res => expect(res).to.have.header('expires') || res);
    });
    it('GET /getHome', () => {
        return chai
            .request(URL)
            .get('/getHome')
            .then(res => {
                expect(res).to.be.json.and.have.header('last-modified');
                expect(res.body).to.have.property('content').that.is.a('string');
                expect(res.body).to.have.property('title').that.is.a('string');
            });
    });
    it('GET /getError', () => {
        return chai
            .request(URL)
            .get('/getError')
            .then(res => {
                expect(res).to.be.json.and.have.header('last-modified');
                expect(res.body).to.have.property('content').that.is.a('string');
                expect(res.body).to.have.property('title').that.is.a('string');
            })
    });
    it('GET /getHelp', () => {
        return chai
            .request(URL)
            .get('/getHelp')
            .then(res => {
                expect(res).to.be.json.and.have.header('last-modified');
                expect(res.body).to.have.property('content').that.is.a('string');
                expect(res.body).to.have.property('title').that.is.a('string');
            })
    });
    it('GET /showParagraph', () => {
        return chai
            .request(URL)
            .get('/showParagraph')
            .query({ paragraph: 13 })
            .then(res => {
                expect(res).to.be.json.and.have.header('last-modified');
                expect(res.body).to.have.property('content').that.is.an('array').with.lengthOf(2);
                expect(res.body.content[0]).to.be.a('string');
                expect(res.body.content[1]).to.be.a('string');
            })
    });
    it('GET /showSum', () => {
        return chai
            .request(URL)
            .get('/showSum')
            .query({ number: 13 })
            .then(res => {
                expect(res).to.be.json;
                expect(res.body).to.have.property('result').that.is.an('array').with.lengthOf(1);
                expect(res.body.result[0]).to.be.an('array').with.lengthOf(3);
                let data = res.body.result[0];
                expect(data[0]).to.be.a('string');
                expect(data[1]).to.be.a('string');
                expect(data[2]).to.be.a('number');
            })
    });
    it('GET /showProblem', () => {
        return chai
            .request(URL)
            .get('/showProblem')
            .query({ problem: 13 })
            .then(res => {
                expect(res).to.be.json.and.have.header('last-modified');
                expect(res.body).to.have.property('content').that.is.an('array').with.lengthOf(2);
                expect(res.body.content[0]).to.be.a('string');
                expect(res.body.content[1]).to.be.a('string');
            })
    });
    it('GET /search', () => {
        return chai
            .request(URL)
            .get('/search')
            .query({ request: 'сила' })
            .then(res => {
                expect(res).to.be.json;
                expect(res.body).to.have.property('result').that.is.an('array');
                expect(res.body.result).all.be.an('array');
                res.body.result.forEach(item => {
                    expect(item).length.within(2, 3);
                    expect(item[0]).to.be.a('number');
                    expect(item[1]).to.be.a('number');
                    if (item[2]) {
                        expect(item[2]).to.be.a('string').equals('paragraph');
                    }
                })
            })
    });
    it('GET /feedback', () => {
        return chai
            .request(URL)
            .get('/feedback')
            .query({ text: 'Hello' })
            .then(res => {
                expect(res).to.be.json;
                expect(res.body).to.have.property('result').that.equals('Hello');
            })
    });
    it('GET /saveimg', () => {
        return API
            .post('/saveimg')
            .attach('file', Buffer.from('Awesome file'), 'AWESOME_FILE.png')
            .then(res => expect(res).to.be.html);
    });
    it.only('GET /getimg<name>', () => {
        return API
            .get('/getimgAWESOME_FILE.png')
            .then(res => expect(res.text).equals('Awesome file'))
    });
    it.skip('GET /edit', () => {
        return API
            .get('/edit')
            .then(res => expect(res).to.be.html);
    });
    it.skip('GET /paidContent', () => {
        return API
            .get('/paidContent')
            .then(res => expect(res).to.be.html);
    });
    it.skip('GET /edit/fill', () => {});
    it.skip('GET /edit/data', () => {});
    it.skip('GET/POST /submit', () => {});
    it.skip('GET /addFile', () => {});
    it.skip('GET /base', () => {
        return API
            .get('/base')
            .then(res => expect(res).to.be.html);
    });
    it.skip('GET /edit/getAllProblems', () => {});
    it.skip('GET /edit/getAll', () => {});
    it.skip('GET /edit/delete', () => {});
    it.skip('GET /TOC', () => {});

    it.skip('GET /helpers<name>', () => {});
    it.skip('404 error', () => {});

});
