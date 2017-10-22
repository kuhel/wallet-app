'use strict';

const path = require('path');
const Koa = require('koa');
const serve = require('koa-static');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser')();

const logger = require('libs/logger')('app');

const { renderToStaticMarkup } = require('react-dom/server');

// Cards Controllers
const getCardsController = require('./controllers/cards/get-cards');
const createCardController = require('./controllers/cards/create');
const deleteCardController = require('./controllers/cards/delete');
const cardToCard = require('./controllers/cards/card-to-card');
const cardToMobile = require('./controllers/cards/card-to-mobile');
const mobileToCard = require('./controllers/cards/mobile-to-card');

// Transaction Controllers
const getTransactionController = require('./controllers/transactions/get');
const createTransactionsController = require('./controllers/transactions/create');
const getTransactionsController = require('./controllers/transactions/get-transactions');

// Error Controller
const errorController = require('./controllers/error');

const ApplicationError = require('libs/application-error');

// Models
const CardsModel = require('source/models/cards');
const TransactionsModel = require('source/models/transactions');


const app = new Koa();

// Mocked User Data
const DATA = {
	user: {
		login: 'samuel_johnson',
		name: 'Samuel Johnson'
	}
};

function getView(viewId) {
	const viewPath = path.resolve(__dirname, 'views', `${viewId}.server.js`);
	delete require.cache[require.resolve(viewPath)];
	return require(viewPath);
}

// Сохраним параметр id в ctx.params.id
router.param('id', (id, ctx, next) => next());

router.get('/', (ctx) => {
	const indexView = getView('index');
	const indexViewHtml = renderToStaticMarkup(indexView(DATA));

	ctx.body = indexViewHtml;
});

router.get('/cards/', getCardsController);
router.post('/cards/', createCardController);
router.delete('/cards/:id', deleteCardController);

router.get('/cards/:id/transactions/', getTransactionController);
router.post('/cards/:id/transactions/', createTransactionsController);

router.post('/cards/:id/transfer', cardToCard);
router.post('/cards/:id/pay', cardToMobile);
router.post('/cards/:id/fill', mobileToCard);

router.get('/transactions/', getTransactionsController);

router.all('/error', errorController);

// logger
app.use(async (ctx, next) => {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// error handler
app.use(async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		logger.error('Error detected', err);
		ctx.status = err instanceof ApplicationError ? err.status : 500;
		ctx.body = `Error [${err.message}] 😬`;
	}
});

// Создадим модель Cards и Transactions на уровне приложения и проинициализируем ее
app.use(async (ctx, next) => {
	ctx.cardsModel = new CardsModel();
	ctx.transactionsModel = new TransactionsModel();

	await Promise.all([
		ctx.cardsModel.loadFile(),
		ctx.transactionsModel.loadFile()
	]);

	await next();
});


app.use(bodyParser);
app.use(router.routes());
app.use(serve('./public'));

app.listen(3000, () => {
	logger.info('Application started');
});

module.exports = app;
