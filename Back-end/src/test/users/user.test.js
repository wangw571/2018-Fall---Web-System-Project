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

describe('users.js - user', () => {

  // Setup testing user
  before(() =>
    new Promise(resolve => {
      request(`/users/${process.env.SYS_ORG}`, 'POST')
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
    describe('From different organization', () => {
      it('it should return error', done => {
        request(`/users/${process.env.SYS_ORG}/${user._id}`)
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

    describe('From same organization', () => {
      it('it should return the user', done => {
        request(`/users/${process.env.SYS_ORG}/${user._id}`)
        .asSystemAdmin()
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
    describe('From reg organization', () => {
      it('it should return error', done => {
        request(`/users/${process.env.SYS_ORG}/${user._id}`, 'POST')
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

    describe('From same organization', () => {
      it('it should return the user', done => {
        request(`/users/${process.env.SYS_ORG}/${user._id}`)
        .asSystemAdmin()
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

  describe('DELETE', () => {
    describe('As different organization', () => {
      it('it should return error', done => {
        request(`/users/${process.env.SYS_ORG}/${user._id}`, 'DELETE')
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

    describe('As user', () => {
      it('it should return the user id', done => {
        request(`/users/${process.env.SYS_ORG}/${user._id}`, 'DELETE')
        .asSystemAdmin()
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status', 'success');
          res.body.should.have.property('data').should.be.a('object');
          res.body.data.should.be.a('string', user._id);
          done();
        });
      });
    });
  });
});