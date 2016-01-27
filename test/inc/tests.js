'use strict';

const assert = require('chai').assert;
const global = {};

module.exports = function() {
  it('save one', function() {
    const doc = {a: 1, b: 2};
    const res = this.silo.save(doc);
    assert.equal(res.length, 1);
    assert.property(res[0], '_id');
    global._id = res[0]._id;
  });

  it('save many', function() {
    const docs = [{b: 2, c: 3}, {c: 3, d: 4}, {d: 4, e: 5}];
    const res = this.silo.save(docs);
    assert.equal(res.length, docs.length);
  });

  it('find one', function() {
    const res = this.silo.find(global._id);
    assert.equal(res.length, 1);
  });

  it('find many', function() {
    const res = this.silo.find({c: 3});
    assert.equal(res.length, 2);
  });

  it('remove by _id', function() {
    let res = this.silo.remove(global._id);
    assert.equal(res, true);
    res = this.silo.find(global._id);
    assert.equal(res.length, 0);
  });
};
