import { CommonRoutesConfig } from '../common/common.routes.config';
import express from 'express';
import { dbService, DbService } from '../common/db.service';
import { OrdersService, ordersService } from './orders.service';

export class OrdersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application, private ordersService: OrdersService) {
    super(app, 'OrdersRoutes');
  }

  configureRoutes() {
    this.app
      .route(`/orders`)
      .get((req: express.Request, res: express.Response) => {
        this.ordersService
          .getList(req.query)
          .then((list) => {
            return res.status(200).json(list);
          })
          .catch((err) => {
            return res.status(500).json({ err });
          });
      })
      .post((req: express.Request, res: express.Response) => {
        this.ordersService
          .create(req.body)
          .then((newClient) => {
            return res.status(201).json(newClient);
          })
          .catch((err) => {
            return res.status(500).json({ err });
          });
      });

    this.app
      .route(`/orders/:number`)
      // .all((req: express.Request, res: express.Response, next: express.NextFunction) => {
      //   next();
      // })
      .get((req: express.Request, res: express.Response) => {
        this.ordersService
          .getById(req.params.number)
          .then((item) => {
            return res.status(200).json(item);
          })
          .catch((err) => {
            return res.status(500).json({ err });
          });
      })
      .patch((req: express.Request, res: express.Response) => {
        this.ordersService
          .update(req.params.number, req.body)
          .then((updated) => {
            return res.status(200).json(updated);
          })
          .catch((err) => {
            return res.status(500).json({ err });
          });
      })
      .delete((req: express.Request, res: express.Response) => {
        this.ordersService
          .delete(req.params.number)
          .then((updated) => {
            return res.status(200).json(updated);
          })
          .catch((err) => {
            return res.status(500).json({ err });
          });
      });

      this.app
      .route(`/orders/:number/complete`).post((req: express.Request, res: express.Response) => {
        this.ordersService
          .complete(req.params.number)
          .then((updated) => {
            return res.status(200).json(updated);
          })
          .catch((err) => {
            return res.status(500).json({ err });
          });
      })

    return this.app;
  }
}
