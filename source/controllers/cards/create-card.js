'use strict';

const CardsModel = require('../../models/cards');

module.exports = async (ctx) => {
	const card = ctx.request.body;
    ctx.body = await new CardsModel().create(card);
};

