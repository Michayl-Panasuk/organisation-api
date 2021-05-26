import DBG from 'debug';
import util from 'util';
import path from 'path';
const debug = DBG('organisation:typography-sqlite3');
const error = DBG('organisation:error-sqlite3');

import { NewEdition, Edition } from '../models/entities';
import { dbService as dbs, DbService } from '../common/db.service';

export class EditionService {
  constructor(private dbService: DbService) {}

  async create(data: NewEdition) {
    const db = await this.dbService.db;
    const item = new NewEdition(data);
    await new Promise((resolve, reject) => {
      const sql = 'INSERT INTO Edition (code, author, name, size, quantity) ' + 'VALUES ( ?, ?, ?, ?, ? );';
      const params = [item.code, item.author, item.name, item.size, item.quantity];
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
    const sql = 'DELETE FROM Edition WHERE number=?';
    const params = number;
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
      db.get('SELECT * FROM Edition WHERE number = ?', [id], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  async getList() {
    const db = await this.dbService.db;
    return await new Promise((resolve, reject) => {
      db.all('SELECT * FROM Edition ORDER BY number DESC', (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  async getListTypes() {
    const db = await this.dbService.db;
    return await new Promise((resolve, reject) => {
      db.all('SELECT * FROM EditionType', (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  async update(id: string, data: Edition) {
    const db = await this.dbService.db;
    const sql = `UPDATE Edition set code = ?, author = ?, name = ?, size = ?, quantity = ? WHERE number = ?`;
    const params = [data.code, data.author, data.name, data.size, data.quantity, id];
    return await new Promise((resolve, reject) => {
      db.run(sql, params, (err: any, result: any) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
}
export const editionsService = new EditionService(dbs);
