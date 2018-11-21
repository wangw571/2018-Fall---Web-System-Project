import chai from 'chai';
import chaiHttp from 'chai-http';
import { request } from '../util';
const should = chai.should();
const req = {
  name: 'testQ1',
  query: [
    { $match: { status: 'A' } },
    { $group: { _id: '$cust_id', total: { $sum: '$amount' } } },
    { $sort: { total: -1 } }
  ]
};
let qid;

chai.use(chaiHttp);
describe('queries.js - queries', () => {

  describe('/', () => {
    describe('GET', () => {

      describe('As from regular organization', () => {
        it('it should return error', done => {
          request('/queries')
            .asRegularAdmin()
            .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('status', 'error');
              res.body.should.have.property('err', 'Insufficient permission');
              done();
            });
        });
      });

      describe('As system admin', () => {
        it('it should return success', done => {
          request('/queries')
          .asSystemAdmin()
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status', 'success');
            res.body.data.should.be.a('array').length(0);
            done();
          });
        });
      });

    });

    describe('POST', () => {
      describe('As system admin', () => {
        it('it should return success', done => {
          request('/queries', 'POST')
          .asSystemAdmin().send(req)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status', 'success');
            res.body.data.should.have.property('name', req.name);
            res.body.data.should.have.property('query', JSON.stringify(req.query));

            qid = res.body.data._id;
            done();
          });
        });
      });
    });
  });

  describe('/:qid', () => {
    describe('GET', () => {

      describe('As system admin', () => {
        it('it should return success', done => {
          request(`/queries/${qid}`)
          .asSystemAdmin()
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status', 'success');
            res.body.data.should.have.property('name', req.name);
            res.body.data.should.have.property('_id', qid);
            res.body.data.should.have.property('query', JSON.stringify(req.query));
            done();
          });
        });
      });

    });

    describe('POST', () => {
      describe('As system admin', () => {
        const req2 = { ...req };
        req2.name = 'banana';
        it('it should return success', done => {
          request(`/queries/${qid}`, 'POST')
          .asSystemAdmin().send(req2)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status', 'success');
            res.body.data.should.have.property('name', 'banana');
            res.body.data.should.have.property('_id', qid);
            res.body.data.should.have.property('query', JSON.stringify(req.query));
            done();
          });
        });
      });
    });

    describe('DELETE', () => {
      describe('As system admin', () => {
        it('it should return success', done => {
          request(`/queries/${qid}`, 'DELETE')
          .asSystemAdmin()
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status', 'success');
            res.body.should.have.property('data', qid);
            done();
          });
        });
      });
    });

  });

});