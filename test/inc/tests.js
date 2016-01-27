'use strict';

const assert = require('chai').assert;
const global = {};

module.exports = function() {
  it('save one', function(done) {
    const doc = {a: 1, b: 2};
    this.silo.save(doc)
      .then(function(res) {
        assert.equal(res.length, 1);
        assert.property(res[0], '_id');
        global._id = res[0]._id;
        done();
      })
      .catch(function(err) {
        done(err);
      });
  });

  it('save many', function(done) {
    const docs = [{b: 2, c: 3}, {c: 3, d: 4}, {d: 4, e: 5}];
    this.silo.save(docs)
      .then(function(res) {
        assert.equal(res.length, docs.length);
        done();
      })
      .catch(function(err) {
        done(err);
      });
  });

  it('find one', function(done) {
    this.silo.find(global._id)
      .then(function(res) {
        assert.equal(res.length, 1);
        done();
      })
      .catch(function(err) {
        done(err);
      });
  });

  it('find many', function(done) {
    this.silo.find({c: 3})
      .then(function(res) {
        assert.equal(res.length, 2);
        done();
      })
      .catch(function(err) {
        done(err);
      });
  });

  it('remove by _id', function(done) {
    const self = this;
    self.silo.remove(global._id)
      .then(function(res1) {
        assert.equal(res1, true);
        self.silo.find(global._id)
          .then(function(res2) {
            assert.equal(res2.length, 0);
            done();
          })
          .catch(function(err) {
            done(err);
          });
      })
      .catch(function(err) {
        done(err);
      });
  });
};
