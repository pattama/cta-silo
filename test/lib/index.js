'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');
const co = require('co');
const Silo = require('../../lib/');
const Db = require('../../lib/db');
const fs = require('fs');
const os = require('os');
const path = require('path');
const shortid = require('shortid');
const filename = os.tmpdir() + path.sep + shortid.generate();
const Context = require('events').EventEmitter;
const docs = [{a: 1}, {b: 2}, {c: 3}];

const cementHelper = {
  constructor: {
    name: 'CementHelper',
  },
  dependencies: {},
  createContext: function() {
    return {
      publish: function() {
      },
    };
  },
};

describe('brick', () => {
  before((done) => {
    try {
      fs.unlink(filename, () => {
        done();
      });
    } catch (e) {
      done();
    }
  });

  const that = this;

  it('instantiate', (done) => {
    try {
      that.brick = new Silo(cementHelper, {
        name: 'silo',
        properties: {
          filename: filename,
        },
      });
      assert.instanceOf(that.brick.db, Db);
      done();
    } catch (e) {
      done(e);
    }
  });

  it('process with document backup', (done) => {
    const spy = sinon.spy();
    const context = new Context();
    context.data = {
      nature: {
        type: 'document',
        quality: 'backup',
      },
      payload: {
        doc: docs,
        cb: spy,
      },
    };
    const _emit = sinon.spy(context, 'emit');
    const _backup = sinon.spy(that.brick.db, 'backup');
    return co(function* coroutine() {
      yield that.brick.process(context);
      sinon.assert.calledWith(_backup, docs);
      const calls = _emit.getCalls()[0].args;
      assert.strictEqual(calls[0], 'done');
      assert.strictEqual(calls[1], 'silo');
      assert.strictEqual(calls[2].length, docs.length);
      sinon.assert.calledWith(spy, calls[2]);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  it('process with document restore', (done) => {
    const spy = sinon.spy();
    const context = new Context();
    context.data = {
      nature: {
        type: 'document',
        quality: 'restore',
      },
      payload: {
        query: {},
        cb: spy,
      },
    };
    const _emit = sinon.spy(context, 'emit');
    const _restore = sinon.spy(that.brick.db, 'restore');
    return co(function* coroutine() {
      yield that.brick.process(context);
      sinon.assert.calledWith(_restore, context.data.payload.query);
      const calls = _emit.getCalls()[0].args;
      assert.strictEqual(calls[0], 'done');
      assert.strictEqual(calls[1], 'silo');
      assert.strictEqual(calls[2].docs.length, docs.length);
      sinon.assert.calledWith(spy, calls[2]);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  it('process with document clear', (done) => {
    const spy = sinon.spy();
    const context = new Context();
    context.data = {
      nature: {
        type: 'document',
        quality: 'clear',
      },
      payload: {
        query: {},
        cb: spy,
      },
    };
    const _emit = sinon.spy(context, 'emit');
    const _clear = sinon.spy(that.brick.db, 'clear');
    return co(function* coroutine() {
      yield that.brick.process(context);
      sinon.assert.calledWith(_clear, context.data.payload.query);
      sinon.assert.calledWith(_emit, 'done', 'silo', docs.length);
      sinon.assert.calledWith(spy, docs.length);
      done();
    }).catch((err) => {
      done(err);
    });
  });
});
