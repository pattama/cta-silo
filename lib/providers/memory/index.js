'use strict';

const _ = require('lodash');
const shortid = require('shortid');

class MemoryProvider {

  constructor() {
    this.data = [];
  }

  save(docs) {
    const self = this;
    const output = [];
    let input;
    if (!Array.isArray(docs)) {
      input = [docs];
    } else {
      input = _.cloneDeep(docs);
    }
    input.forEach(function(doc) {
      if (!('_id' in doc)) {
        doc._id = shortid.generate();
      }
      self.data.push(doc);
      output.push(doc);
    });
    return output;
  }

  find(query) {
    const self = this;
    if (typeof query === 'undefined') {
      return self.data;
    }
    if (typeof query === 'string') {
      const obj = {_id: query};
      return _.filter(self.data, obj);
    }
    if (typeof query === 'object') {
      return _.filter(self.data, query);
    }
    return null;
  }

  remove(query) {
    const self = this;
    try {
      if (typeof query === 'undefined') {
        self.data = [];
      } else if (typeof query === 'string') {
        const obj = {_id: query};
        self.data = _.reject(self.data, obj);
      } else if (typeof query === 'object') {
        self.data = _.reject(self.data, query);
      }
    } catch (e) {
      console.error(e.message);
      return false;
    }
    return true;
  }

}

exports = module.exports = MemoryProvider;

