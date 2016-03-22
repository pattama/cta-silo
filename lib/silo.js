'use strict';

const providers = {
  nedb: require('./providers/nedb'),
};

class Silo {
  constructor(providerName, providerOptions) {
    if (typeof providerName !== 'string') {
      throw new Error('Silo => Missing silo provider name');
    }
    if ( !(providerName in providers) ) {
      throw new Error('Silo => Unknown silo provider "' + providerName + '"');
    }
    this.provider = new providers[providerName](providerOptions);
  }

  save(docs) {
    return this.provider.save(docs);
  }

  find(query) {
    return this.provider.find(query);
  }

  remove(query) {
    return this.provider.remove(query);
  }

}

exports = module.exports = Silo;
