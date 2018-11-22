import chai from 'chai';
import fs from 'fs';
import { request } from '../util';
const should = chai.should();
let id;

describe('submit.js', () => {

  describe('/', () => {
    describe('GET', () => {
      it('it should give an list with 1 item', done => {
        request('/submit').asSystemAdmin()
        .end((err, res) => {

          // Check returns an success object
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status', 'success');
          res.body.data.should.be.a('array').length(1);
          done();
        });
      });
    });
  });


  describe('/:tid', () => {

    // Create a template for testing
    before(() =>
      new Promise(resolve => {
        request('/temp', 'POST').asSystemAdmin()
        .attach('file', fs.readFileSync('mock.xlsx'), 'mock.xlsx')
        .end((err, res) => {
          id = res.body.data;
          resolve();
        });
      })
    );

    describe('POST', () => {
      it('it should give the submission', done => {
        request(`/submit/${id}`, 'POST').asSystemAdmin()
        .attach('file', fs.readFileSync('mock.xlsx'), 'mock.xlsx')
        .end((err, res) => {

          // Check returns an success object
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status', 'success');

          // Check submitted data
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('_org');
          res.body.data.should.have.property('_temp', id);
          res.body.data.should.have.property('date');
          res.body.data.should.have.property('submitted', false);
          res.body.data.data.should.be.a('array').length(1);
          done();
        });
      });
    });

    describe('GET', () => {
      it('it should give the submission', done => {
        request(`/submit/${id}`).asSystemAdmin()
        .attach('file', fs.readFileSync('mock.xlsx'), 'mock.xlsx')
        .end((err, res) => {

          // Check returns an success object
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status', 'success');

          // Check submitted data
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('_org');
          res.body.data.should.have.property('_temp', id);
          res.body.data.should.have.property('date');
          res.body.data.should.have.property('submitted', false);
          res.body.data.data.should.be.a('array').length(1);

          done();
        });
      });
    });

    describe('PATCH', () => {
      it('it should give the updated submission', done => {
        request(`/submit/${id}`, 'PATCH').asSystemAdmin()
        .send({ submitted: true })
        .end((err, res) => {

          // Check returns an success object
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status', 'success');

          // Check submitted data
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('_org');
          res.body.data.should.have.property('_temp', id);
          res.body.data.should.have.property('date');
          res.body.data.should.have.property('submitted', true);
          res.body.data.data.should.be.a('array').length(1);
          done();
        });
      });
    });

    describe('DELETE', () => {
      it('it should remove the submission', done => {
        request(`/submit/${id}`, 'DELETE').asSystemAdmin()
        .end((err, res) => {

          // Check returns an success object
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status', 'success');
          res.body.should.have.property('data', id);
          done();
        });
      });

      it('it should be removed from db', done => {
        request('/submit').asSystemAdmin()
        .end((err, res) => {

          // Check returns an success object
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status', 'success');
          res.body.data.should.be.a('array').length(1);
          done();
        });
      });
    });

    // Remove testing template
    after(() =>
      new Promise(resolve => {
        request(`/temp/${id}`, 'DELETE').asSystemAdmin()
        .attach('file', fs.readFileSync('mock.xlsx'), 'mock.xlsx')
        .end((err, res) => {
          resolve();
        });
      })
    );
    
  });
});