'use strict';

const Brick = require('cta-brick');
const co = require('co');
const Silo = require('./silo');

class SiloCement extends Brick {
  constructor (cementHelper, config) {
    super(cementHelper, config);
    if (typeof config.properties.provider.name !== 'string') {
      throw new Error('Silo => Missing silo provider name');
    }
    const providerName = config.properties.provider.name;
    const providerOptions = config.properties.provider.options || {};
    this.silo = new Silo(providerName, providerOptions);
  }

  /**
   * backup json in silo when mq service is down
   * */
  doJob (json, callback) {
    const that = this;
    // save to disc
    if (json.nature.type === 'testStatus' && json.nature.quality === 'save') {
      return new Promise((resolve, reject) => {
        that.silo.save(json.payload)
          .then(function (res) {
            resolve(res);
          })
          .catch(function (err) {
            /*
             TODO should we improve resiliency here, what happens if both mq & silo are down:
             - raise alarm & save to memory?
             - stop agent?
             */
            reject(err);
          });
      });
    // read from disc & publish to channel
    } else if (json.nature.type === 'testStatus' && json.nature.quality === 'read') {
      return new Promise((resolve, reject) => {
        that.silo.find()
          .then(function(data) {
            if (Array.isArray(data)) {
              data.forEach((e) => {
                that.cementHelper.createContext(e)
                  .on('accept', function onContextAccept(who) {
                    console.log(`${that.name}: ${who} accepted`);
                  })
                  .on('reject', function onContextReject(who, rej) {
                    console.log(`${that.name}: ${who} rejected with ` + rej);
                  })
                  .on('done', function onContextDone(who, result) {
                    console.log(`${that.name}: ${who} done with ` + JSON.stringify(result));
                  })
                  .on('error', function onContextError(who, error) {
                    console.log(`${that.name}: ${who} failed with ` + error);
                  })
                  .publish();
                that.silo.remove(e);
              });
            } else {
              console.log('Silo => there are no data on disc to publish');
            }
            resolve();
          })
          .catch(function(err) {
            // TODO resiliency
            reject(err);
          });
      });
    } else {
      return Promise.resolve();
    }
  }

  onData (context) {
    const that = this;
    return co(function* onDataCoroutine () {
      context.emit('accept', that.name);
      const res = yield that.doJob(context.data);
      context.emit('done', that.name, res);
    }).catch((err) => {
      context.emit('reject', that.name, err);
      context.emit('error', that.name, err);
    });
  }

}

exports = module.exports = SiloCement;
