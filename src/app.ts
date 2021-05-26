import express from 'express';
import * as http from 'http';
import * as bodyparser from 'body-parser';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';

import { CommonRoutesConfig } from './common/common.routes.config';
import { ClientsRoutes } from './clients/clients.routes.config';
import { dbService } from './common/db.service';
import { clientsService } from './clients/clients.servise';
import { TypographyRoutes } from './typgraphy/typography.routes.config';
import { typographyService } from './typgraphy/typography.service';
import { EditionsRoutes } from './editions/editions.routes.config';
import { editionsService } from './editions/editions.service';
import { OrdersRoutes } from './orders/orders.routes.config';
import { ordersService } from './orders/orders.service';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const routes: CommonRoutesConfig[] = [];

// here we are adding middleware to parse all incoming requests as JSON
app.use(
  bodyparser.json({
    limit: '10mb',
    verify(req: any, res, buf, encoding) {
      req.rawBody = buf;
    }
  })
);

// here we are adding middleware to allow cross-origin requests
app.use(cors());

// here we are configuring the expressWinston logging middleware,
// which will automatically log all HTTP requests handled by Express.js
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.colorize(), winston.format.json())
  })
);

// here we are adding the UserRoutes to our array,
// after sending the Express.js application object to have the routes added to our app!
routes.push(
  new ClientsRoutes(app, clientsService),
  new TypographyRoutes(app, typographyService),
  new EditionsRoutes(app, editionsService),
  new OrdersRoutes(app, ordersService)
);

// here we are configuring the expressWinston error-logging middleware,
// which doesn't *handle* errors per se, but does *log* them
app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.colorize(), winston.format.json())
  })
);

// this is a simple route to make sure everything is working properly
app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send(`Server up and running!`);
});

export { app, server, routes };
