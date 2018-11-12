import chai from 'chai';
import chaiHttp from 'chai-http';
import { request } from '../util';
const should = chai.should();
let user = {
  firstname: 'a',
  lastname: 'b',
  email: 'a@b.ca',
  admin: false,
  password: 'password'
};

chai.use(chaiHttp);

describe('users.js - me', () => {

  // Setup testing user
  before(() =>
    new Promise(resolve => {
      request(`/users/${process.env.REG_ORG}`, 'POST')
      .asSystemAdmin()
      .send(user).end((err, res) => {
        request('/login', 'POST')
        .asNoOne()
        .send({ email: user.email, password: user.password })
        .end((err, res2) => {
          user = res2.body.data;
          resolve();
        })
      });
    })
  );

  describe('GET', () => {
    describe('As a user', () => {
      it('it should return success', done => {
        request('/users/me')
        .asSpecified(user.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status', 'success');
          res.body.should.have.property('data').should.be.a('object');
          res.body.data._id.should.be.a('string', user._id);
          res.body.data.admin.should.be.a('boolean', user.admin);
          res.body.data.firstname.should.be.a('string', user.firstname);
          res.body.data.lastname.should.be.a('string', user.lastname);
          res.body.data.email.should.be.a('string', user.email);
          done();
        });
      });
    });
  });

  describe('POST', () => {
    describe('As user', () => {
      it('it should return editted user', done => {
        request('/users/me', 'POST')
        .asSpecified(user.token)
        .send({ firstname: 'rest' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status', 'success');
          res.body.should.have.property('data').should.be.a('object');
          res.body.data._id.should.be.a('string', user._id);
          res.body.data.admin.should.be.a('boolean', user.admin);
          res.body.data.firstname.should.be.a('string', 'rest');
          res.body.data.lastname.should.be.a('string', user.lastname);
          res.body.data.email.should.be.a('string', user.email);
          done();
        });
      });
    });
  });

  // Remove testing user
  after(() =>
    new Promise(resolve => {
      request(`/users/${process.env.REG_ORG}/${user._id}`, 'DELETE')
      .asSystemAdmin()
      .end(() =>
        resolve()
      );
    })
  );
});