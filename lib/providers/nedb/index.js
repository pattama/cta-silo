'use strict';

const Datastore = require('nedb');

class NeDbProvider {

  constructor(options, logger) {
    const that = this;
    that.logger = logger;
    const params = {timestampData: true};
    if (options && options.filename) {
      that.logger.info('Path to file storage: ' + options.filename);
      params.filename = options.filename;
      params.autoload = true;
    }
    this.db = new Datastore(params);
  }

  save(docs) {
    const self = this;
    return new Promise((resolve, reject) => {
      self.db.insert(docs, function(err, newDocs) {
        if (err) {
          reject(err);
        } else {
          let res = newDocs;
          if ((typeof newDocs === 'object') && '_id' in newDocs) {
            res = [newDocs];
          }
          resolve(res);
        }
      });
    });
  }

  find(query) {
    const self = this;
    const obj = typeof query === 'string' ? {_id: query} : query;
    return new Promise((resolve, reject) => {
      self.db.find(obj).sort({createdAt: 1}).exec(function(err, docs) {
        if (err) {
          reject(err);
        } else {
          let res = docs;
          if ((typeof docs === 'object') && '_id' in docs) {
            res = [docs];
          }
          resolve(res);
        }
      });
    });
  }

  remove(query) {
    const self = this;
    const obj = typeof query === 'string' ? {_id: query} : query;
    return new Promise((resolve, reject) => {
      self.db.remove(obj, { multi: true }, function(err, numRemoved) {
        if (err) {
          reject(err);
        } else {
          resolve(numRemoved);
        }
      });
    });
  }

}

exports = module.exports = NeDbProvider;

