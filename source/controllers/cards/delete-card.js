'use strict';

const CardsModel = require('../../models/cards');

module.exports = async (ctx) => {
	const cardId = parseInt(ctx.params['id'], 10);
    ctx.body = await new CardsModel().remove(cardId);
};
