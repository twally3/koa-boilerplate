import Koa from 'koa';
import Router from 'koa-router';
import Logger from 'koa-logger';
import Cors from '@koa/cors';
import BodyParser from 'koa-bodyparser';
import Helmet from 'koa-helmet';
import respond from 'koa-respond';
import routes from './routes';
import bristol from 'bristol';
import palin from 'palin';

const app = new Koa();
const router = new Router();

app.silent = true;

app.use(Helmet());

if (process.env.NODE_ENV === 'development') {
	app.silent = false;
	bristol
		.addTarget('console')
		.withFormatter(palin, { rootFolderName: 'koa-boilerplate' });
	app.use(Logger(str => bristol.log('debug', str)));
}

app.use(Cors());
app.use(
	BodyParser({
		enableTypes: ['json'],
		jsonLimit: '5mb',
		strict: true,
		onerror: (err, ctx) => {
			ctx.throw('body parse error', 422);
		}
	})
);

app.use(respond());

app.use(async (ctx, next) => {
	try {
		return await next();
	} catch (err) {
		ctx.status = err.status || 500;
		const [message, stack] = ['message', 'stack'].map(key =>
			process.env.NODE_ENV === 'developments' ? err[key] : undefined
		);
		ctx.body = { error: err.name, message, stack };
		ctx.app.emit('error', err, ctx);
	}
});

// API routes
routes(router);
app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
