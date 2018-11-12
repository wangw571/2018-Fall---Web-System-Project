import chai from 'chai';
import fs from 'fs';
import { request } from '../util';
const should = chai.should();
let file;

describe('temp.js', () => {

  describe('/', () => {

    describe('POST', () => {
      it('it should give the posted item', done => {
        request('/temp', 'POST').asSystemAdmin()
        .attach('file', fs.readFileSync('mock.xlsx'), 'mock.xlsx')
        .end((err, res) => {

          // Check returns an success object
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status', 'success');
          res.body.data.should.be.a('string');

          // Store _id for cleanup
          file = res.body.data;
          done();
        });
      });
    });

    describe('POST', () => {
      it('it should stop duplicate upload', done => {
        request('/temp', 'POST').asSystemAdmin()
        .attach('file', fs.readFileSync('mock.xlsx'), 'mock.xlsx')
        .end((err, res) => {

          // Check returns an error object
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('status', 'error');
          res.body.should.have.property('err');
          done();
        });
      });
    });

    describe('GET', () => {
      describe('As regular user', () => {
        it('it should give an empty list', done => {
          request('/temp').asRegularUser().end((err, res) => {

            // Check returns an empty list successfully
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status', 'success');
            res.body.should.have.property('data');
            res.body.data.should.be.a('array').length(0);
            done();
          });
        });
      });

      describe('As super user', () => {
        it('it should give a list with 1 item', done => {
          request('/temp').asSystemUser().end((err, res) => {

            // Check returns an empty list successfully
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status', 'success');
            res.body.should.have.property('data');

            // Check data integrity
            res.body.data.should.be.a('array').length(1);
            res.body.data[0].should.be.have.property('_id', file);
            done();
          });
        });
      });
    });
  });


  describe('/:id', () => {

    describe('GET', () => {
      it('it should give the template', done => {
        request('/temp').asSystemAdmin().end((err, res) => {

          // Check returns an empty list successfully
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status', 'success');
          res.body.should.have.property('data');
          res.body.data.should.be.a('array').length(1);
          done();
        });
      });
    });

    describe('POST', () => {
      it('it should update the template', done => {
        request(`/temp/${file}`, 'POST').asSystemAdmin()
        .send({ name: 'testing' })
        .end((err, res) => {

          // Check returns an success object
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status', 'success');

          // Check if returned data is correct format and updated
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id', file);
          res.body.data.should.have.property('filename');
          res.body.data.should.have.property('description');
          res.body.data.should.have.property('name', 'testing');
          res.body.data.should.have.property('columns');
          res.body.data.columns.should.be.a('array');

          done();
        });
      });
    });

    describe('DELETE', () => {
      it('it should remove the template', done => {
        request(`/temp/${file}`, 'DELETE').asSystemAdmin()
        .end((err, res) => {

          // Check returns an success object
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status', 'success');
          res.body.should.have.property('data', file);
          done();
        });
      });

      it('it should be removed from db', done => {
        request('/temp').asSystemUser().end((err, res) => {

          // Check returns an empty list successfully
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status', 'success');
          res.body.should.have.property('data');

          // Check data integrity
          res.body.data.should.be.a('array').length(0);
          done();
        });
      });
    });
  });
});