const chai = require('chai');
const chaiHttp = require('chai-http');
const { assert, expect } = require("chai");
const path = require('path');

var app = require('../source/app');
var request = require('supertest').agent(app.listen());

var mochaAsync = (fn) => {
    return (done) => {
        try {
            fn();
            done();
        } catch (err) {
            done(err);
        }
    };
};

describe('CARDS', () => {
    describe('GET /', () => {
        it('Should return Status Code 200 for simple request', mochaAsync(async () => {
            const req = await request.get('/cards');
            expect(req.statusCode).to.equal(200);
        }));
        it('Should return Array of cards', mochaAsync(async () => {
            const req = await request.get('/cards');
            expect(req.body instanceof Array)
        }));
    });

    describe('POST /', () => {
        it('Valid card request', mochaAsync(async () => {
            const req = await request.post('/cards').send(testCards[0]);
            expect(req.statusCode).to.equal(200);
        }));
        it('Not valid card request', mochaAsync(async () => {
            const req = await request.post('/cards').send(testCards[1]);
            console.log(req);
            expect(req.statusCode).to.not.equal(200);
        }));
    });
});

const pathDB = path.join(__dirname, '..',  'db', 'cards.json');

const testCards = [
    {
        "cardNumber": "3566002020360505",
        "balance": "150",
        "id": 4
    },
    {
        "cardNumber": "45619612123345467",
        "balance": "150",
        "id": 4
    },
];
