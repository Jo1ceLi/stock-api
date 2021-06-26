import { configure, getLogger } from 'log4js';
import app from './app';

const PORT = 8080;
app.listen(PORT, () => {
    configure({
        appenders: { out: { type: 'stdout', layout: { type: 'basic' } } },
        categories: { default: { appenders: ['out'], level: 'info' } },
    });
    const logger = getLogger();
    logger.info(`🚀 Server ready at http://localhost:${PORT}`);
});
