import { CommonRoutesConfig } from '../common/common.routes.config';
import express from 'express';
import { dbService, DbService } from '../common/db.service';
import { TypographyService } from './typography.service';

export class TypographyRoutes extends CommonRoutesConfig {
  constructor(app: express.Application, private typographyService: TypographyService) {
    super(app, 'ClientsRoutes');
  }

  configureRoutes() {
    this.app
      .route(`/typographies`)
      .get((req: express.Request, res: express.Response) => {
        this.typographyService
          .getList()
          .then((list) => {
            return res.status(200).json(list);
          })
          .catch((err) => {
            return res.status(500).json({ err });
          });
      })
      .post((req: express.Request, res: express.Response) => {
        this.typographyService.create(req.body).then(newClient => {
          return res.status(201).json(newClient);
        }).catch((err) => {
          return res.status(500).json({ err });
        });
      });

    this.app
      .route(`/typographies/:typographyId`)
      // .all((req: express.Request, res: express.Response, next: express.NextFunction) => {
      //   next();
      // })
      .get((req: express.Request, res: express.Response) => {
        this.typographyService.getById(req.params.typographyId).then(item => {
          return res.status(200).json(item);
        }).catch((err) => {
          return res.status(500).json({ err });
        });
      })
      .patch((req: express.Request, res: express.Response) => {
        this.typographyService.update(req.params.typographyId, req.body)
        .then((updated) => {
          return res.status(200).json({ updated });
        })
        .catch((err) => {
          return res.status(500).json({ err });
        });
      })
      .delete((req: express.Request, res: express.Response) => {
        this.typographyService
        .delete(req.params.typographyId)
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
