import DBG from 'debug';
import util from 'util';
import path from 'path';
const debug = DBG('organisation:typography-sqlite3');
const error = DBG('organisation:error-sqlite3');

import { Client, NewPrintOrder, NewTypography, PrintOrder, Typography } from '../models/entities';
import { dbService as dbs, DbService } from '../common/db.service';
import { ClientsService, clientsService } from '../clients/clients.servise';
import { EditionService, editionsService } from '../editions/editions.service';
import { TypographyService, typographyService } from '../typgraphy/typography.service';

export class OrdersService {
  constructor(
    private dbService: DbService,
    private clients: ClientsService,
    private editions: EditionService,
    private typographies: TypographyService
  ) {}

  async create(data: NewPrintOrder) {
    const db = await this.dbService.db;

    const item = new NewPrintOrder(data);
    debug;
    return await new Promise((resolve, reject) => {
      const sql =
        'INSERT INTO PrintOrder (editionNumber, clientId, typographyId, editionType, responsible) ' +
        'VALUES ( ?, ?, ?, ?, ? );';
      const params = [item.editionNumber, item.clientId, item.typographyId, item.editionType, item.responsible];
      const stmt = db.prepare(sql);

      stmt.run(...params, async (err) => {
        if (err) return reject(err);
        const newItem = await this.getById((stmt as any).lastID);
        resolve(newItem);
      });
    });
  }

  async delete(number: string) {
    const db = await this.dbService.db;
    const sql = 'DELETE FROM PrintOrder WHERE number=?';
    const params = number;
    return await new Promise((resolve, reject) => {
      const stmt = db.prepare(sql);
      stmt.run(params, async (err) => {
        if (err) return reject(err);
        resolve((stmt as any).changes);
      });
    });
  }

  async getById(number: string): Promise<PrintOrder> {
    const db = await this.dbService.db;
    return await new Promise((resolve, reject) => {
      db.get('SELECT * FROM PrintOrder WHERE number = ?', [number], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  async getList(q?) {
    const db = await this.dbService.db;

    return await new Promise((resolve, reject) => {
        const qParams = this.createSearchSTM(q);
        db.all(qParams[0], qParams[1], (err: any, result: any) => {
          if (err) return reject(err);
          resolve(result || []);
        });
    });
  }

  async update(number: string, data: PrintOrder) {
    const db = await this.dbService.db;
    const q = `UPDATE PrintOrder set editionNumber = ?, clientId = ?, typographyId = ?, editionType = ?,  responsible = ?  WHERE number = ?`;
    const params = [data.editionNumber, data.clientId, data.typographyId, data.editionType, data.responsible, number];
    return await new Promise((resolve, reject) => {
      db.run(q, params, (err: any, result: any) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  async complete(id: string) {
    const db = await this.dbService.db;
    const sql = `UPDATE PrintOrder set completedAt = ?, completed = ?`;
    const params = [new Date().toISOString(), true];
    const stmt = db.prepare(sql);

    return await new Promise(async (resolve, reject) => {
      try {
        const order = await this.getById(id);
        let data;
        if (order) {
          data = await Promise.all([
            this.clients.getById(order.clientId),
            this.editions.getById(order.editionNumber),
            this.typographies.getById(order.typographyId)
          ]);
        }
        if (order && data.every((entity) => !!entity)) {
          stmt.run(params, async (err: any) => {
            if (err) return reject(err);
            const completedOrder = await this.getById(id);
            resolve(completedOrder);
          });
        } else {
          reject('Not exist');
        }
      } catch (err) {
        return reject(err);
      }
    });
  }

  private createSearchSTM(rawQ): [string, any[]] {
    let q = 'SELECT * FROM PrintOrder';


    const conditions = [];
    const values = [];
    if (!rawQ || Object.values(rawQ).length === 0) {
      q += ' ORDER BY number DESC';
      return [q, values];
    }

    if (rawQ.completed) {
      values.push(true);
      conditions.push('PrintOrder.completed=?');
    }

    if (rawQ.search) {
      const s = `%${rawQ.search}%`;
      q += ' INNER JOIN Edition ON PrintOrder.editionNumber = Edition.number';
      conditions.push('(PrintOrder.number LIKE ? OR PrintOrder.responsible LIKE ? OR Edition.code LIKE ?)');
      values.push(...[s, s, s]);
    }

    if (rawQ.from) {
      conditions.push('date(PrintOrder.createdAt) >= date(?)');
      values.push(rawQ.from);
    }
    if (rawQ.to) {
      conditions.push('date(PrintOrder.createdAt) <= date(?)');
      values.push(rawQ.from);
    }
    q += ' WHERE ' + conditions.join(' AND ');
    return [q, values];
  }
}
export const ordersService = new OrdersService(dbs, clientsService, editionsService, typographyService);
