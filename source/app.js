'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser')();
const router  = require('koa-router')();
const serve = require('koa-static');

// Cards Controllers
const getCardsController = require('./controllers/cards/get-cards');
const createCardController = require('./controllers/cards/create-card');
const deleteCardController = require('./controllers/cards/delete-card');
const errorController = require('./controllers/cards/error');

// Transaction Controllers
const getTransactionsController = require('./controllers/transactions/get-transactions');
const createTransactionController = require('./controllers/transactions/create-transaction');

const app = new Koa();

app.use(bodyParser);
app.use(router.routes());
app.use(serve('./public'));

app.use(async (ctx, next) => {
	const start = new Date();
	await next();
	const ms  = new Date() - start;
	console.log(`${ctx.method} ${ctx.url}: time ${ms}`)
})

// app.use(bodyParser.json());
// app.param(['id'], (req, res, next) => next());
router.param(['id'], (id, ctx, next) => next());

router.get('/cards/', getCardsController);
router.post('/cards/', createCardController);
router.delete('/cards/:id', deleteCardController);
router.all('/error/', errorController);

// Transactions
router.get('/cards/:id/transactions/', getTransactionsController);
router.post('/cards/:id/transactions/', createTransactionController);

app.listen(3000, () => {
	console.log('Application started');
});

module.exports = app;
