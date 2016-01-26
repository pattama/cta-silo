'use strict';

const tests = require('./inc/tests');
const Silo = require('../lib');

['memory', 'diskdb'].forEach(function(provider) {
  describe(provider + ' provider', function () {
    before(function() {
      this.silo = new Silo(provider);
      this.silo.remove();
    });
    tests();
  });
});
