const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const config = require('./config/env');
const openapi = require('./docs/openapi');
const routes = require('./routes');
const notFound = require('./shared/middleware/notFound');
const errorHandler = require('./shared/middleware/errorHandler');

const app = express();

if (config.trustProxy) app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));

app.get('/api/v1/docs.json', (req, res) => res.status(200).json(openapi));
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(openapi, { explorer: true }));
app.use('/api/v1', routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
