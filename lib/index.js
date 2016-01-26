'use strict';

const providers = {
  memory: require('./providers/memory'),
  diskdb: require('./providers/diskdb'),
};

class Silo {
  constructor(providerName, providerConfig) {
    if (typeof providerName !== 'string') {
      throw new Error('Missing provider name');
    }
    if ( !(providerName in providers) ) {
      throw new Error('Unknown provider "' + providerName + '"');
    }
    this.provider = new providers[providerName](providerConfig);
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
