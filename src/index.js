import {} from 'dotenv/config';
import server from './server';
import bristol from 'bristol';

const port = process.env.PORT || 8080;
server.listen(port, _ => {
	bristol.debug(
		`Server listening on ${process.env.PORT} in ${process.env.NODE_ENV} mode`
	);
});
