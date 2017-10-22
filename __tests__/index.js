'use strict';

const app = require('../source/app');
const request = require('supertest');
const fs = require('fs');
const sinon = require('sinon');

let sandbox = null;

beforeEach(() => {
    sandbox = sinon.sandbox.create();
});

afterEach(() => {
    sandbox.restore();
});

describe('Routes: /cards/', () => {
    test('Should respond with list of cards', async () => {
        const response = await request(app.listen()).get('/cards/');
        const data = response.body;
        expect(response.status).toEqual(200);
        expect(response.type).toEqual('application/json');
        expect(data.length).toBeGreaterThan(0);
        expect(data).toBeInstanceOf(Array);
    });
});


const Cards = require('source/models/cards');

const goodCard = {
    "cardNumber": "5285858668252774",
    "balance": 1000
};

const fakeCard = {
    "cardNumber": "437784000000000",
    "balance": 666
};

const CardsModel = new Cards();

describe('Cards Model', () => {
    test('getAll method returns some data and data is instance of Array', () => {
        expect.assertions(2);
        return CardsModel.getAll()
        .then(data => {
            expect(data.length).toBeGreaterThan(0);
            expect(data).toBeInstanceOf(Array);
        });
    });
    test('create method returns new card if card data is valid', () => {
        expect.assertions(2);
        return CardsModel.create(goodCard)
        .then(data => {
            expect(data.cardNumber).toEqual(goodCard.cardNumber);
            expect(data).toHaveProperty('id');
        });
    });
    test('create method returns Error if card data is invalid', () => {
        // expect(() => {
        //     CardsModel.create(fakeCard);
        // })
        // .toThrowError();
        expect.assertions(1);
        return CardsModel.create(fakeCard)
        .catch((erorr) => {
            expect(erorr.message).toEqual('💳 Card data is invalid');
        });
    });
})

describe('FS work', () => {
    test('saves the content', () => {
        const writeFileStub = sinon.stub(fs, 'writeFile').resolves();
        expect.assertions(3);
        return CardsModel.create(goodCard)
        .then(data => {
            expect(data.cardNumber).toEqual(goodCard.cardNumber);
            expect(data).toHaveProperty('id');
            expect(writeFileStub).toBeCalled();
        });
    });
});