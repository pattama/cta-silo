'use strict';

const DataStore = require('nedb');

class NeDbProvider {
  /**
   * Class constructor
   * @param {String|Object} options - filename or nedb options object
   * @param {String} options.filename - nedb filename
   * @param logger
   */
  constructor(options, logger) {
    const that = this;
    that.logger = logger;
    const params = {
      timestampData: true,
      autoload: true,
    };
    if (options && typeof options === 'string') {
      params.filename = options;
    } else if (options && typeof options === 'object' && options.filename) {
      params.filename = options.filename;
    } else {
      throw new Error('Missing filename');
    }
    that.logger.info('Path to file storage set to ' + params.filename);
    this.db = new DataStore(params);
  }

  /**
   * Backup documents to file storage
   * @param {Array|Object} docs - documents to backup
   * @returns {Promise}
   */
  backup(docs) {
    const that = this;
    return new Promise((resolve, reject) => {
      that.db.insert(docs, function(err, newDocs) {
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

  /**
   * Restore documents from file storage
   * @param {String|Object} query - document id or query object
   * @param {Boolean} clear - whether to clear restored document from file storage or not, default to false
   * @returns {Promise}
   */
  restore(query, clear) {
    const that = this;
    const obj = typeof query === 'string' ? {_id: query} : query;
    return new Promise((resolve, reject) => {
      that.db.find(obj).sort({createdAt: 1}).exec(function(err, docs) {
        if (err) {
          reject(err);
        } else {
          if (clear === true) {
            const ids = docs.map((e) => {
              return e._id;
            });
            that.clear({_id: {$in: ids}})
            .then(() => {
              resolve({docs: docs, cleared: true});
            })
            .catch(() => {
              resolve({docs: docs, cleared: err});
            });
          } else {
            resolve({docs: docs, cleared: false});
          }
        }
      });
    });
  }

  /**
   * Clear documents from file storage
   * @param {String|Object} query - document id or query object
   * @returns {Promise}
   */
  clear(query) {
    const that = this;
    const obj = typeof query === 'string' ? {_id: query} : query;
    return new Promise((resolve, reject) => {
      that.db.remove(obj, { multi: true }, function(err, numRemoved) {
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
