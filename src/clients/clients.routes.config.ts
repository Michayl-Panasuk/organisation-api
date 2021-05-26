import { CommonRoutesConfig } from '../common/common.routes.config';
import express from 'express';
import { dbService, DbService } from '../common/db.service';
import { ClientsService } from './clients.servise';

export class ClientsRoutes extends CommonRoutesConfig {
  constructor(app: express.Application, private clientsService: ClientsService) {
    super(app, 'ClientsRoutes');
  }

  configureRoutes() {
    this.app
      .route(`/clients`)
      .get((req: express.Request, res: express.Response) => {
        this.clientsService
          .getList()
          .then((list) => {
            return res.status(200).json(list);
          })
          .catch((err) => {
            return res.status(500).json({ err });
          });
      })
      .post((req: express.Request, res: express.Response) => {
        this.clientsService
          .create(req.body)
          .then((newClient) => {
            return res.status(201).json(newClient);
          })
          .catch((err) => {
            return res.status(500).json({ err });
          });
      });

    this.app
      .route(`/clients/:clientId`)
      .all((req: express.Request, res: express.Response, next: express.NextFunction) => {
        next();
      })
      .get((req: express.Request, res: express.Response) => {
        this.clientsService
          .getById(req.params.clientId)
          .then((item) => {
            return res.status(200).json({ item });
          })
          .catch((err) => {
            return res.status(500).json({ err });
          });
      })
      .patch((req: express.Request, res: express.Response) => {
        this.clientsService
          .update(req.params.clientId, req.body)
          .then((updated) => {
            return res.status(200).json(updated);
          })
          .catch((err) => {
            return res.status(500).json({ err });
          });
      })
      .delete((req: express.Request, res: express.Response) => {
        this.clientsService
          .delete(req.params.clientId)
          .then((updated) => {
            return res.status(200).json(updated);
          })
          .catch((err) => {
            return res.status(500).json({ err });
          });
      });

    return this.app;
  }
}
