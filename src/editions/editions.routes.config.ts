import { CommonRoutesConfig } from '../common/common.routes.config';
import express from 'express';
import { dbService, DbService } from '../common/db.service';
import { EditionService, editionsService } from './editions.service';

export class EditionsRoutes extends CommonRoutesConfig {
  constructor(app: express.Application, private editionService: EditionService) {
    super(app, 'ClientsRoutes');
  }

  configureRoutes() {
    this.app
    .route(`/edition-types`)
    .get((req: express.Request, res: express.Response) => {
      this.editionService
        .getListTypes()
        .then((list) => {
          return res.status(200).json(list);
        })
        .catch((err) => {
          return res.status(500).json({ err });
        });
    })

    this.app
      .route(`/editions`)
      .get((req: express.Request, res: express.Response) => {
        this.editionService
          .getList()
          .then((list) => {
            return res.status(200).json(list);
          })
          .catch((err) => {
            return res.status(500).json({ err });
          });
      })
      .post((req: express.Request, res: express.Response) => {
        this.editionService.create(req.body).then(newItem => {
          return res.status(201).json(newItem);
        }).catch((err) => {
          return res.status(500).json({ err });
        });
      });

    this.app
      .route(`/editions/:number`)
      .all((req: express.Request, res: express.Response, next: express.NextFunction) => {
        next();
      })
      .get((req: express.Request, res: express.Response) => {
        this.editionService.getById(req.params.number).then(item => {
          return res.status(200).json({ item });
        }).catch((err) => {
          return res.status(500).json({ err });
        });
      })
      .patch((req: express.Request, res: express.Response) => {
        this.editionService.update(req.params.number, req.body)
        .then((updated) => {
          return res.status(200).json(updated);
        })
        .catch((err) => {
          return res.status(500).json({ err });
        });
      })
      .delete((req: express.Request, res: express.Response) => {
        this.editionService
        .delete(req.params.number)
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
