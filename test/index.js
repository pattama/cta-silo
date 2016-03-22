'use strict';

const tests = require('./inc/tests');
const Silo = require('../lib/silo');
const os = require('os');
const path = require('path');

const providers = [
  {
    title: 'nedb in-memory mode',
    name: 'nedb',
    options: null,
  },
  {
    title: 'nedb persistent mode',
    name: 'nedb',
    options: os.tmpdir() + path.sep + 'test',
  },
];

providers.forEach(function(provider) {
  describe(provider.title, function() {
    before(function() {
      this.silo = new Silo(provider.name, provider.options);
      this.silo.remove({});
    });
    tests();
  });
});
