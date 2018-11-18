import chai from 'chai';
import chaiHttp from 'chai-http';
import { request } from '../util';
const should = chai.should();

chai.use(chaiHttp);
describe('queries.js - queries', () => {

    // Setup testing queries
  before(() =>
  new Promise(resolve => {
    request(`/queries`, 'POST')
    .asSystemAdmin()
    .send({name: "testQ1", query:'[{ $match: { status: "A" } },{ $group: { _id: "$cust_id", total: { $sum: "$amount" } } },{ $sort: { total: -1 } }]'})
    .end((err, res) => {
    });
    request(`/queries`, 'POST')
    .asSystemAdmin()
    .send({name: "testQ2", query:'[{ $match: { status: "A" } },{ $group: { _id: "$cust_id", total: { $sum: "$amount" } } },{ $sort: { total: -1 } }]'})
    .end((err, res) => {
    });
  })
);

  describe('/', () => {
    describe('GET', () => {

      describe('As regular organization', () => {
        it('it should return error', done => {
          request('/users')
          .asRegularAdmin()
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status', 'success');
            res.body.data.should.be.a('array').length(2);
            done();
          });
        });
      });

      describe('As system organization', () => {
        it('it should return error', done => {
          request('/users')
          .asSystemAdmin()
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status', 'success');
            res.body.data.should.be.a('array').length(4);
            done();
          });
        });
      });

    });
  });

  describe('/:org', () => {
    describe('GET', () => {

      describe('As different organization', () => {
        it('it should return error', done => {
          request(`/users/${process.env.SYS_ORG}`)
          .asRegularAdmin()
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.be.a('object');
            res.body.should.have.property('status', 'error');
            res.body.should.have.property('err');
            done();
          });
        });
      });

      describe('As same organization', () => {
        it('it should return error', done => {
          request(`/users/${process.env.SYS_ORG}`)
          .asSystemAdmin()
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status', 'success');
            res.body.data.should.be.a('array').length(2);
            done();
          });
        });
      });

    });
  });
});