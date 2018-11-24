import chai from 'chai';
import { request } from '../util';
const should = chai.should();
const user = {
  firstname: 'testf',
  lastname: 'testl',
  admin: false,
  email: 'b@b.com',
  password: 'password'
};

describe('auth.js', () => {

  before(() =>
    new Promise(resolve => {
      request(`/users/${process.env.REG_ORG}`, 'POST')
      .asSystemAdmin().send(user).end((err, res) => {
        const { _id, _org } = res.body.data;
        user._id = _id;
        user._org = _org;
        resolve()
      });
    })
  );

  describe('/login', () => {
    describe('Bad login', () => {
      it('should give an error', done => {
        request('/login', 'POST')
        .asNoOne()
        .send({ email: 'sdsadsad', password: 'sdadsadsadsa' })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('status', 'error');
          res.body.should.have.property('err');
          done();
        });
      });
    });

    describe('Valid login', () => {
      it('should give an error', done => {
        request('/login', 'POST')
        .asNoOne()
        .send({ email: user.email, password: user.password })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status', 'success');
          res.body.data.should.have.property('_id', user._id);
          res.body.data.should.have.property('_org', user._org);
          res.body.data.should.have.property('firstname', user.firstname);
          res.body.data.should.have.property('lastname', user.lastname);
          res.body.data.should.have.property('email', user.email);
          res.body.data.should.have.property('admin', user.admin);
          res.body.data.should.have.property('token');

          user.token = res.body.data.token;
          done();
        });
      });
    });
  });

  describe('/logout', () => {
    describe('Bad logout', () => {
      it('should give an error', done => {
        request('/logout', 'POST')
        .asNoOne()
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.a('object');
          res.body.should.have.property('status', 'error');
          res.body.should.have.property('err');
          done();
        });
      });
    });

    describe('Valid logout', () => {
      it('should give user id', done => {
        request('/logout', 'POST')
        .asSpecified(user.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status', 'success');
          res.body.should.have.property('data', user._id);     
          done();
        });
      });
    });
  });

  after(() =>
    new Promise(resolve => {
      request(`/users/${process.env.REG_ORG}/${user._id}`, 'DELETE')
      .asSystemAdmin().end((err, res) =>
        resolve()
      );
    })
  );

})