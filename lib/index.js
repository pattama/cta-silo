/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

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
      if (context.data.nature.type !== 'documents') {
        context.emit('reject', that.name, `Type '${context.data.nature.type}' not supported`);
        return;
      }
      let res;
      if (context.data.nature.quality === 'backup') {
        res = yield that.db.backup(context.data.payload.doc);
        if (typeof context.data.payload.cb === 'function') {
          context.data.payload.cb(res);
        }
      } else if (context.data.nature.quality === 'restore') {
        res = yield that.db.restore(context.data.payload.query, context.data.payload.clear);
        if (Array.isArray(res.docs) && res.docs.length) {
          that.logger.info(`restored ${res.docs.length} document(s) from silo`);
        } else {
          that.logger.info('Nothing to restore from silo');
        }
        if (typeof context.data.payload.cb === 'function') {
          context.data.payload.cb(res);
        }
      } else if (context.data.nature.quality === 'clear') {
        res = yield that.db.clear(context.data.payload.query);
        if (res > 0) {
          that.logger.info(`Cleared ${res} document(s) from silo`);
        }
        if (typeof context.data.payload.cb === 'function') {
          context.data.payload.cb(res);
        }
      } else {
        context.emit('reject', that.name, `Quality '${context.data.nature.quality}' not supported`);
        return;
      }
      context.emit('done', that.name, res);
    }).catch((err) => {
      context.emit('reject', that.name, err);
      context.emit('error', that.name, err);
    });
  }

}

module.exports = Silo;
