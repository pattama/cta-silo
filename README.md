CTA-SILO
========

This brick provides a backup & restore utility for documents that transit in a flowcontrol application 

First refer to cta-brick and cta-flowcontrol repositories to familiarize yourself with those concepts.

Like all bricks, it can be easily injected into a flowcontrol application using a configuration

# Brick dependencies

none

# Brick properties

filename: path to a file for storage

# Brick contracts

| nature.type | nature.quality | payload sample
| --- | --- | --- | ---
| document | backup | {doc: {foo: 'bar'}} or {doc: [{foo: 'bar'}, {bar: 'foo'}]} 
| document | restore | {query: {}, clear: true}
| document | clear | {query: {}}

All payloads accept a callback function

# Configuration sample

````javascript
'use strict';

module.exports = {
  name: 'io sample',
  tools: [{
    name: 'logger',
    module: 'cta-logger',
    properties: {
      level: 'silly',
    },
    scope: 'all',
    singleton: true,
  }, {
    name: 'messaging',
    module: 'cta-messaging',
    properties: {
      provider: 'rabbitmq',
      parameters: {
        url: 'amqp://localhost?heartbeat=60',
        reConnectAfter: 5000,
      },
    },
    singleton: true,
  }],
  bricks: [{
    name: 'producer',
    module: '../../cta-io/samples/flowcontrol/silo/producer.js',
    properties: {},
    publish: [{
      topic: 'produce.com',
      data: [{}],
    }],
  }, {
    name: 'io',
    module: 'cta-io',
    dependencies: {
      messaging: 'messaging',
    },
    properties: {
      output: {
        queue: 'output.sample',
      },
    },
    subscribe: [{
      topic: 'produce.com',
      data: [{}],
    }],
    publish: [{
      topic: 'documents.com',
      data: [{
        nature: {
          type: 'document',
          quality: 'backup',
        },
      }, {
        nature: {
          type: 'document',
          quality: 'restore',
        },
      }],
    }],
  }, {
    name: 'silo',
    module: 'cta-silo',
    properties: {
      filename: require('os').tmpDir() + require('path').sep + 'sample.db',
    },
    subscribe: [{
      topic: 'documents.com',
      data: [{
        nature: {
          type: 'document',
          quality: 'backup',
        },
      }, {
        nature: {
          type: 'document',
          quality: 'restore',
        },
      }, {
        nature: {
          type: 'document',
          quality: 'clear',
        },
      }],
    }],
  }],
};
````

