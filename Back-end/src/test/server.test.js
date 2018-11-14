import chai from 'chai';
import chaiHttp from 'chai-http';
import { server } from '../server';
const should = chai.should();

chai.use(chaiHttp);
describe('server.js', () => {
  describe('POST - Invalid endpoint', () => {
    it('it should return 404', done => {
      chai.request(server).get('/').end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('status', 'error');
        res.body.should.have.property('err', 'Invalid endpoint/method');
        done();
      });
    });
  });
});