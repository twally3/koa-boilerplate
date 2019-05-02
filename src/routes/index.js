export default router => {
	router.get('/', async ctx => ctx.send(200, 'Hello World'));
};
