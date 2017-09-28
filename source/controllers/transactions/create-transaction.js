'use strict';

const TransactionModel = require('../../models/transaction');

module.exports = async(ctx) => {
    const cardId = parseInt(ctx.params['id'], 10);
    const transaction = ctx.request.body;
    ctx.body = await new TransactionModel().create(cardId, transaction);
};

