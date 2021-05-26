import DBG from 'debug';
import util from 'util';
import path from 'path';
const debug = DBG('organisation:clients-sqlite3');
const error = DBG('organisation:error-sqlite3');

import { Client, NewClient } from '../models/entities';
import { dbService as dbs, DbService } from '../common/db.service';
import { RunResult } from 'sqlite3';

export class ClientsService {
  constructor(private dbService: DbService) {}

  async create(data: NewClient) {
    const db = await this.dbService.db;
    const client = new NewClient(data);
    const sql = 'INSERT INTO Client (fio, private, phone, address, fax) ' + 'VALUES ( ?, ?, ?, ?, ? );';
    const params = [client.fio, client.private, client.phone, client.address, client.fax || null];
    return await new Promise((resolve, reject) => {
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
    const sql = 'DELETE FROM Client WHERE id = ?';
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
      db.get('SELECT * FROM Client WHERE id = ?', [id], (err, row) => {
        if (err) return reject(err);
        resolve(this.mapClient(row));
      });
    });
  }

  async getList(q?: string) {
    const db = await this.dbService.db;
    return await new Promise((resolve, reject) => {
      db.all('SELECT * FROM Client ORDER BY id DESC', (err, rows) => {
        if (err) return reject(err);
        resolve(this.mapClients(rows));
      });
    });
  }

  async update(id: string, data: Client) {
    const db = await this.dbService.db;
    const sql = `UPDATE Client set fio = ?, private = ?, phone = ?, address = ?, fax = ? WHERE id = ?`;
    const params = [data.fio, data.private, data.phone, data.address, data.fax, id];
    return await new Promise((resolve, reject) => {
      db.run(sql, params, (err: any, result: any) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  protected mapClients(list: Client[]): Client[] {
    return list.map((c) => ({ ...c, private: !!c.private }));
  }

  protected mapClient(item: Client): Client {
    return { ...item, private: !!item.private };
  }
}
export const clientsService = new ClientsService(dbs);
