import chai from 'chai';
import chaiHttp from 'chai-http';
import { request } from '../util';
const should = chai.should();
let qid1, qid2, qidtemp;

chai.use(chaiHttp);
describe('queries.js - queries', () => {

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
                            res.body.should.have.property('data');
                            console.log(res.body.data);
                            done();
                        });
                });
            });

        });
        describe('POST', () => {

            describe('As from regular organization', () => {
                it('it should return error', done => {
                    request('/queries', "POST")
                        .asRegularAdmin()
                        .send({name: "qTest", query:'[{ $match: { status: "A" } }]'})
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
                    request('/queries', "POST")
                        .asSystemAdmin()
                        .send({name: "qTest", query:'[{ $match: { status: "A" } }]'})
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('status', 'success');
                            res.body.should.have.property('data');
                            qidtemp = res.body.data._id;
                            console.log(res.body.data);
                            done();
                        });

                        request(`/queries/${qidtemp}`, "DELETE")
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
    });
});