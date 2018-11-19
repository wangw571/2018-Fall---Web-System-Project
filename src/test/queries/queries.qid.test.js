import chai from 'chai';
import chaiHttp from 'chai-http';
import { request } from '../util';
const should = chai.should();
let qid1, qid2, qidtemp;

chai.use(chaiHttp);
describe('users.js - users', () => {

    // Setup testing queries
    before(() =>
        new Promise(resolve => {
            request(`/queries`, 'POST')
                .asSystemAdmin()
                .send({ name: "testQ1", query: '[{ $match: { status: "A" } },{ $group: { _id: "$cust_id", total: { $sum: "$amount" } } },{ $sort: { total: -1 } }]' })
                .end((err, res) => {
                    qid1 = res.body._id;
                });
            request(`/queries`, 'POST')
                .asSystemAdmin()
                .send({ name: "testQ2", query: '[{ $match: { status: "A" } },{ $group: { _id: "$cust_id", total: { $sum: "$amount" } } },{ $sort: { total: -1 } }]' })
                .end((err, res) => {
                    qid2 = res.body._id;
                });
            resolve();
        })
    );

    // Remove testing queries
    after(() =>
        new Promise(resolve => {
            request(`/queries/${qid1}`, 'DELETE')
                .asSystemAdmin()
                .end((err, res) => {
                    resolve();
                });
            request(`/queries/${qid2}`, 'DELETE')
                .asSystemAdmin()
                .end((err, res) => {
                    resolve();
                });
        })
    );

    describe('/qid', () => {
        describe('GET', () => {

            describe('As from regular organization', () => {
                it('it should return error', done => {
                    request(`/queries/${qid1}`)
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
                    request(`/queries/${qid1}`)
                        .asSystemAdmin()
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('status', 'success');
                            res.body.should.have.property('data');
                            console.log(res.body.data);
                            done();
                        });
                });
            });

        });
        describe('DELETE', () => {

            describe('As from regular organization', () => {
                it('it should return error', done => {
                    request(`/queries/${qid1}`, "DELETE")
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
                    request(`/queries/${qid1}`, "DELETE")
                        .asSystemAdmin()
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('status', 'success');
                            res.body.should.have.property('data');
                            console.log(res.body.data);
                            done();
                        });
                });
            });

            describe('As system admin, deleting non-existed query', () => {
                it('it should return error', done => {
                    request(`/queries/notExisted`, "DELETE")
                        .asSystemAdmin()
                        .end((err, res) => {
                            res.should.have.status(401);
                            res.body.should.be.a('object');
                            res.body.should.have.property('status', 'error');
                            res.body.should.have.property('err');
                            done();
                        });
                });
            });
        });

        describe('POST', () => {

            describe('As from regular organization', () => {
                it('it should return error', done => {
                    request(`/queries/${qid1}`, "POST")
                        .asRegularAdmin()
                        .send({ name: "qTestSt" })
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
                    request(`/queries/${qid1}`, "POST")
                        .asSystemAdmin()
                        .send({ query: '[{ $match: { status: "AAA" } }]' })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('status', 'success');
                            res.body.should.have.property('data');
                            console.log(res.body.data);
                            done();
                        });
                });
            });
            describe('As system admin, edit non-existed query', () => {
                it('it should return error', done => {
                    request(`/queries/notExisted`, "POST")
                        .asSystemAdmin()
                        .send({ query: '[{ $match: { status: "AAA" } }]' })
                        .end((err, res) => {
                            res.should.have.status(401);
                            res.body.should.be.a('object');
                            res.body.should.have.property('status', 'error');
                            res.body.should.have.property('err');
                            done();
                        });
                });
            });
        });
    });
});