'use strict';

let co = require('co');
process.env.DEBUG = 'node-vault'
const VAULT = require('node-vault');
const CONFIG = require('./config');

let vault = VAULT(CONFIG.vault);

let log = (obj) => console.log(JSON.stringify(obj, null, '  ') + '\n');

co(function *() {
  let result;

  log(yield vault.status())
  result = yield vault.initialized();
  log(result);
  if (!result.initialized)log(yield vault.init({ secret_shares: 1, secret_threshold: 1 }));
  log(yield vault.status())
  // log(yield vault.enableAudit(CONFIG.audit))
  // log(yield vault.audits())
  log(yield vault.write('secret/hello', { value: 'world', lease: '1s' }))
  let val = yield vault.read('secret/hello')
  while(val) {
    val = yield vault.read('secret/hello')
  }

}).catch((e) => console.log(e.stack));
