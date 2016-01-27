'use strict';

const providers = {
  nedb: require('./providers/nedb'),
};

class Silo {
  constructor(providerName, providerOptions) {
    if (typeof providerName !== 'string') {
      throw new Error('Missing provider name');
    }
    if ( !(providerName in providers) ) {
      throw new Error('Unknown provider "' + providerName + '"');
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
