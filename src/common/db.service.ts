import sqlite3 from 'sqlite3';
import rootPath from 'app-root-path';
import { promisify } from 'util';

export class DbService {
  private dbInstance: sqlite3.Database;
  constructor(private config: { filepath: string }) {
    this.connectDB();
  }

  get db() {
    return this.connectDB()
  }

  async connectDB() {
    if (this.dbInstance) return this.dbInstance;
    const dbfile = this.config.filepath;
    await new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbfile, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) return reject(err);
        this.dbInstance = db
        resolve(this.dbInstance);
      });
    });
    await this.dbInstance.exec('PRAGMA foreign_keys = ON;')
    return this.dbInstance;
  }
}

export const dbService = new DbService({
  filepath: rootPath.path + '/db/app-dev.db'
});