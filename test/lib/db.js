'use strict';

const assert = require('chai').assert;
const Db = require('../../lib/db');
const fs = require('fs');
const os = require('os');
const path = require('path');
const shortid = require('shortid');
const filename = os.tmpdir() + path.sep + shortid.generate();

const logger = {
  info: function info() {
    console.log(arguments);
  },
};

let db = null;

describe('db', () => {
  before((done) => {
    try {
      fs.unlink(filename, () => {
        done();
      });
    } catch (e) {
      done();
    }
  });

  describe('instantiation', () => {
    it('should reject when missing filename', (done) => {
      try {
        const foo = new Db();
        done('should not be here');
      } catch (e) {
        assert(e);
        done();
      }
    });
    it('should pass when done correctly', (done) => {
      try {
        db = new Db(filename, logger);
        done();
      } catch (e) {
        done(e);
      }
    });
  });
  describe('main features', () => {
    it('backup one', (done) => {
      db.backup({_id: '1', type: 'odd'})
        .then((res) => {
          assert.equal(res.length, 1);
          assert.strictEqual(res[0]._id, '1');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('backup many', (done) => {
      const docs = [{_id: '2', type: 'even'}, {_id: '3', type: 'odd'}, {_id: '4', type: 'even'}, {_id: 'a', type: 'alpha'}, {_id: 'b', type: 'alpha'}];
      db.backup(docs)
        .then((res) => {
          assert.equal(res.length, docs.length);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('restore one by id', (done) => {
      db.restore('1')
        .then((res) => {
          assert.equal(res.docs.length, 1);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('restore many by property', (done) => {
      db.restore({type: 'even'})
        .then((res) => {
          assert.equal(res.docs.length, 2);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('restore & clear one', (done) => {
      db.restore('1', true)
        .then((res) => {
          assert.strictEqual(res.docs.length, 1);
          assert.strictEqual(res.cleared, true);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('restore & clear many', (done) => {
      db.restore({type: 'even'}, true)
        .then((res) => {
          assert.strictEqual(res.docs.length, 2);
          assert.strictEqual(res.cleared, true);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('clear one', (done) => {
      db.clear('3')
        .then((res) => {
          assert.strictEqual(res, 1);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('clear many', (done) => {
      db.clear({type: 'alpha'})
        .then((res) => {
          assert.strictEqual(res, 2);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
