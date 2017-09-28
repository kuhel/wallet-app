'use strict';

const TransactionModel = require('../../models/transaction');

module.exports = async(ctx) => {
    const cardId = parseInt(ctx.params['id'], 10);
    console.dir(cardId);
    ctx.body = await new TransactionModel().getTransactions(cardId);
    if (ctx.body.length > 0) {
        ctx.status = 200
    } else {
        ctx.status = 204;
    }
};

