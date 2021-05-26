import DBG from 'debug';
import util from 'util';
import path from 'path';
const debug = DBG('organisation:typography-sqlite3');
const error = DBG('organisation:error-sqlite3');

import { NewTypography, Typography } from '../models/entities';
import { dbService as dbs, DbService } from '../common/db.service';

export class TypographyService {
  constructor(private dbService: DbService) {}

  async create(data: NewTypography) {
    const db = await this.dbService.db;
    const item = new NewTypography(data);
    return await new Promise((resolve, reject) => {
      const sql = 'INSERT INTO Typography (name, address, phone, contactPerson) ' + 'VALUES ( ?, ?, ?, ? );';
      const params = [item.name, item.address, item.phone, item.contactPerson];
      const stmt = db.prepare(sql);

      stmt.run(...params, async (err) => {
        if (err) return reject(err);
        const newItem = await this.getById((stmt as any).lastID);
        resolve(newItem);
      });
    });
  }

  async delete(id: string) {
    const db = await this.dbService.db;
    const sql = 'DELETE FROM Typography WHERE id=?';
    const params = id;
    return await new Promise((resolve, reject) => {
      const stmt = db.prepare(sql);
      stmt.run(params, async (err) => {
        if (err) return reject(err);
        resolve((stmt as any).changes);
      });
    });
  }

  async getById(id: any) {
    const db = await this.dbService.db;
    return await new Promise((resolve, reject) => {
      db.get('SELECT * FROM Typography WHERE id = ?', [id], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  async getList() {
    const db = await this.dbService.db;
    return await new Promise((resolve, reject) => {
      db.all('SELECT * FROM Typography ORDER BY id DESC', (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  async update(id: string, data: Typography) {
    const db = await this.dbService.db;
    return await new Promise((resolve, reject) => {
      const q = `UPDATE Typography set name = ?, address = ?, phone = ?, contactPerson WHERE id = ?`;
      const params = [data.name, data.address, data.phone, data.contactPerson, id];
      db.run(q, params, (err: any, result: any) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
}
export const typographyService = new TypographyService(dbs);
