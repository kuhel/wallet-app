'use strict';

const CardsModel = require('../../models/cards');

module.exports = async(ctx) => {
    ctx.body = await new CardsModel().getAll();
};

