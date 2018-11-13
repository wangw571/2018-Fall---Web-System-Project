import chai from 'chai';
import { request } from '../util';
const should = chai.should();
let org;

describe('orgs.js', () => {

  describe('/', () => {
    describe('GET', () => {
      describe('As regular organization', () => {
        it('it should give an error', done => {
          request('/orgs')
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
      describe('As system organization', () => {
        it('it should give list of organizations', done => {
          request('/orgs')
          .asSystemAdmin()
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status', 'success');
            res.body.should.have.property('data');
            res.body.data.should.be.a('array').length(2);
            done();
          });
        });
      });
    });

    describe('POST', () => {
      describe('As regular organization', () => {
        it('it should give an error', done => {
          request('/orgs', 'POST')
          .asRegularAdmin()
          .send({ name: "TESTORG" })
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.be.a('object');
            res.body.should.have.property('status', 'error');
            res.body.should.have.property('err');
            done();
          });
        });
      });
      describe('As system organization', () => {
        it('it should give the new organization', done => {
          request('/orgs', 'POST')
          .asSystemAdmin()
          .send({ name: "TESTORG" })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status', 'success');
            res.body.should.have.property('data');
            res.body.data.should.have.property('_id');
            res.body.data.should.have.property('name', 'TESTORG');
            res.body.data.should.have.property('_sys', false);
            res.body.data.should.have.property('permissions');
            res.body.data.permissions.should.be.a('array').length(0);

            org = res.body.data;
            done();
          });
        });
        it('it should be in the database', done => {
          request('/orgs')
          .asSystemAdmin()
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status', 'success');
            res.body.should.have.property('data');
            res.body.data.should.be.a('array').length(3);
            done();
          });
        });
      });
    });

  });

  describe('/:org', () => {
    describe('GET', () => {
      describe('As regular organization', () => {
        it('should give an error', done => {
          request(`/orgs/${org._id}`)
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
      describe('As system organization', () => {
        it('should give list of organizations', done => {
          request(`/orgs/${org._id}`)
          .asSystemAdmin()
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status', 'success');
            res.body.should.have.property('data');
            res.body.data.should.have.property('_id', org._id);
            res.body.data.should.have.property('name', org.name);
            res.body.data.should.have.property('_sys', org._sys);
            res.body.data.should.have.property('permissions');
            res.body.data.permissions.should.be.a('array').length(0);
            done();
          });
        });
      });
    });

    describe('POST', () => {
      describe('As regular organization', () => {
        it('should give an error', done => {
          request(`/orgs/${org._id}`, 'POST')
          .asRegularAdmin()
          .send({ name: "TESTORG" })
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.be.a('object');
            res.body.should.have.property('status', 'error');
            res.body.should.have.property('err');
            done();
          });
        });
      });
      describe('As system organization', () => {
        it('should give the updated organization', done => {
          request(`/orgs/${org._id}`, 'POST')
          .asSystemAdmin()
          .send({ name: "ORGTEST" })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status', 'success');
            res.body.should.have.property('data');
            res.body.data.should.have.property('_id', org._id);
            res.body.data.should.have.property('name', 'ORGTEST');
            res.body.data.should.have.property('_sys', org._sys);
            res.body.data.should.have.property('permissions');
            res.body.data.permissions.should.be.a('array').length(0);
            done();
          });
        });
      });
    });

    describe('DELETE', () => {
      describe('As regular organization', () => {
        it('should give an error', done => {
          request(`/orgs/${org._id}`, 'DELETE')
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
      describe('As system organization', () => {
        it('should give the removed organization', done => {
          request(`/orgs/${org._id}`, 'DELETE')
          .asSystemAdmin()
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status', 'success');
            res.body.should.have.property('data');
            res.body.data.should.have.property('_org', org._id);
            res.body.data.should.have.property('usersDeleted', 0);
            done();
          });
        });
        it('should be removed from the database', done => {
          request('/orgs')
          .asSystemAdmin()
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status', 'success');
            res.body.should.have.property('data');
            res.body.data.should.be.a('array').length(2);
            done();
          });
        });
      });
    });

  });
});
