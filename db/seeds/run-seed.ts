import devData from '../data/development-data/index';
import seed from './seed.js';
import db from '../connection';

const runSeed = async () => {
  return seed(devData).then(() => db.end());
};

runSeed();
