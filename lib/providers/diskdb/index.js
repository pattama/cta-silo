'use strict';

const diskDb = require('diskdb');
const os = require('os');

function connect(path, collection) {
  const connection = diskDb.connect(path, [collection]);
  return connection[collection];
}

class DiskDbProvider {

  constructor(path, collection) {
    this.path = path ? path : os.tmpdir();
    this.collection = collection ? collection : 'noname';
    this.db = connect(this.path, this.collection);
  }

  save(docs) {
    let res = this.db.save(docs);
    if ((typeof res === 'object') && '_id' in res) {
      res = [res];
    }
    return res;
  }

  find(query) {
    const obj = typeof query === 'string' ? {_id: query} : query;
    return this.db.find(obj);
  }

  remove(query) {
    const obj = typeof query === 'string' ? {_id: query} : query;
    const res = this.db.remove(obj);
    if (typeof query === 'undefined') {
      this.db = connect(this.path, this.collection);
    }
    return res;
  }

}

exports = module.exports = DiskDbProvider;
