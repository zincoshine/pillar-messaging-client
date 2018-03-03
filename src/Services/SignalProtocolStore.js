
var jsonfile = require('jsonfile')
const str2ab =require('string-to-arraybuffer')
const signal = require('signal-protocol')




var SignalProtocolStore = (function(storeNb){

  
  //SignalProtocolStore.prototype = {
    return{
    store : {},

    Direction: {
      SENDING: 1,
      RECEIVING: 2,
    },
  
    getIdentityKeyPair: function() {
        console.log('GET IDENTITY KEY PAIR')
        console.log(this.get('identityKey'))
        let identityKey = this.get('identityKey')
      //return Promise.resolve({pubKey : str2ab(identityKey.pubKey), privKey : str2ab(identityKey.privKey)});
      return Promise.resolve({pubKey : identityKey.pubKey, privKey : identityKey.privKey});
    },
    getLocalRegistrationId: function() {
      console.log('\n')
      console.log(this.store)
      console.log('\n')
      console.log(this.get('identityKey'))
      return Promise.resolve(this.get('registrationId'));
    },
    put: function(key,value) {
      if (key === undefined || value === undefined || key === null || value === null)
        throw new Error("Tried to store undefined/null");
      this.store[key] = value;
    },
    get: function(key, defaultValue) {
        if (key === null || key === undefined)
            throw new Error("Tried to get value for undefined/null key");
        if (key in this.store) {
            return this.store[key];
        } else {
            return defaultValue;
      }
    },
    remove: function(key) {
      if (key === null || key === undefined)
        throw new Error("Tried to remove value for undefined/null key");
      delete this.store[key];
    },
  
    isTrustedIdentity: function(identifier, identityKey, direction) {

        
      if (identifier === null || identifier === undefined) {
        throw new Error("tried to check identity key for undefined/null key");
      }
      if (!(identityKey instanceof ArrayBuffer)) {
        throw new Error("Expected identityKey to be an ArrayBuffer");
      }
      var trusted = this.get('identityKey' + identifier);
      if (trusted === undefined) {
        return Promise.resolve(true);
      }
      console.log('IS TRUSTED IDENTITY')
      return Promise.resolve(identityKey.toString() === trusted.toString());
    },
    loadIdentityKey: function(identifier) {
        console.log('LOAD IDENTITY KEY')
      if (identifier === null || identifier === undefined)
        throw new Error("Tried to get identity key for undefined/null key");
      return Promise.resolve(this.get('identityKey' + identifier));
    },
    saveIdentity: function(identifier, identityKey) {
        console.log('SAVE IDENTITY')
        console.log(identifier)
        console.log(typeof(identifier))
      if (identifier === null || identifier === undefined)
        throw new Error("Tried to put identity key for undefined/null key");
  
      var address = new signal.SignalProtocolAddress.fromString(identifier+'.1');
        console.log(address)
      var existing = this.get('identityKey' + address.getName());
      this.put('identityKey' + address.getName(), identityKey)
  
      if (existing && util.toString(identityKey) !== util.toString(existing)) {
        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
  
    },
  
    /* Returns a prekeypair object or undefined */
    loadPreKey: function(keyId) {
        console.log('LOAD PREKEY')
      var res = this.get('25519KeypreKey' + keyId);
      if (res !== undefined) {
        res = { pubKey: res.pubKey, privKey: res.privKey };
      }
      return Promise.resolve(res);
    },
    storePreKey: function(keyId, keyPair) {
      return Promise.resolve(this.put('25519KeypreKey' + keyId, keyPair));
    },
    removePreKey: function(keyId) {
      return Promise.resolve(this.remove('25519KeypreKey' + keyId));
    },
  
    /* Returns a signed keypair object or undefined */
    loadSignedPreKey: function(keyId) {
        console.log('LOAD SIGNED PREKEY')
      var res = this.get('25519KeysignedKey' + keyId);
      if (res !== undefined) {
        res = { pubKey: res.pubKey, privKey: res.privKey };
      }
      return Promise.resolve(res);
    },
    storeSignedPreKey: function(keyId, keyPair) {
      return Promise.resolve(this.put('25519KeysignedKey'+keyId,keyPair));
    },
    removeSignedPreKey: function(keyId) {
      return Promise.resolve(this.remove('25519KeysignedKey' + keyId));
    },
  
    loadSession: function(identifier) {
        console.log('LOAD SESSION')
        console.log(this.store)
        console.log(identifier)
        console.log(this.get('session' + identifier))
      return Promise.resolve(this.get('session' + identifier));
    },
    storeSession: function(identifier, record) {
      console.log('STORE SESSION')
      return Promise.resolve(this.put('session' + identifier, record));
    },
    removeSession: function(identifier) {
      return Promise.resolve(this.remove('session' + identifier));
    },
    removeAllSessions: function(identifier) {
      for (var id in this.store) {
        if (id.startsWith('session' + identifier)) {
          delete this.store[id];
        }
      }
      return Promise.resolve();
    }
  };
  })
  module.exports.SignalProtocolStore = SignalProtocolStore