'use strict';

const Brick = require('cta-brick');
const co = require('co');
const Db = require('./db');

class Silo extends Brick {
  constructor(cementHelper, config) {
    super(cementHelper, config);
    const that = this;
    that.db = new Db(config.properties, that.logger);
  }

  process(context) {
    const that = this;
    return co(function* coroutine() {
      let res;
      if (context.data.nature.type === 'document' && context.data.nature.quality === 'backup') {
        res = yield that.db.backup(context.data.payload.doc);
        if (typeof context.data.payload.cb === 'function') {
          context.data.payload.cb(res);
        }
      } else if (context.data.nature.type === 'document' && context.data.nature.quality === 'restore') {
        res = yield that.db.restore(context.data.payload.query, context.data.payload.clear);
        if (Array.isArray(res.docs) && res.docs.length) {
          that.logger.info(`restored ${res.docs.length} document(s) from silo`);
        } else {
          that.logger.info('Nothing to restore from silo');
        }
        if (typeof context.data.payload.cb === 'function') {
          context.data.payload.cb(res);
        }
      } else if (context.data.nature.type === 'document' && context.data.nature.quality === 'clear') {
        res = yield that.db.clear(context.data.payload.query);
        if (res > 0) {
          that.logger.info(`Cleared ${res} document(s) from silo`);
        }
        if (typeof context.data.payload.cb === 'function') {
          context.data.payload.cb(res);
        }
      }
      context.emit('done', that.name, res);
    }).catch((err) => {
      context.emit('reject', that.name, err);
      context.emit('error', that.name, err);
    });
  }

}

exports = module.exports = Silo;
