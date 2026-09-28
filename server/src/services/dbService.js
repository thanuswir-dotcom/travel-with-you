import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readDB as rawReadDB, writeDB as rawWriteDB } from '../../db.js';

export const readDB = () => {
  return rawReadDB();
};

export const writeDB = (data) => {
  return rawWriteDB(data);
};
