'use strict';

const diskDb = require('diskdb');

class DiskDbProvider {

  constructor() {
    this.db = diskDb.connect('d:\\diskdb', ['test']);
  }

  save(docs) {
    let res = this.db.test.save(docs);
    if ((typeof res === 'object') && '_id' in res) {
      res = [res];
    }
    return res;
  }

  find(query) {
    if (typeof query === 'string') {
      const obj = {_id: query};
      return this.db.test.find(obj);
    }
    return this.db.test.find(query);
  }

  remove(query) {
    const res = this.db.test.remove(query);
    if (typeof query === 'undefined') {
      this.db = diskDb.connect('d:\\diskdb', ['test']);
    }
    return res;
  }

}

exports = module.exports = DiskDbProvider;
