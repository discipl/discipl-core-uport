let vows = require('vows')
let assert = require('assert')
const uportConnect = require('uport-connect')
let uPortConnector = require('../index.js')
const qrcode = require('qrcode-terminal');
let connector = new uPortConnector()
var tmpSsid = null
var tmpReference = null
var tmpReference2 = null

const uriHandler = (uri) => {
  qrcode.generate(uri, {small: true})
  console.log(uri)
}

let suite = vows.describe('discipl-core-uport').addBatch({
  'getName() ' : {
    topic : 'uport',
    ' returns "memory"' : function (topic) {
      assert.equal(connector.getName(), topic)
      tmpSsid = null
      tmpReference = null
    }
  }}).addBatch({
  'configure()' : {
    topic : function () {
      vows = this
      try {
        connector.configure("WIGO4IT IDENTITY", {
        uriHandler,
        clientId: '2op3XWF4dpPYuyvFw5UpoQviVRs8wihzHZj',
        network: 'rinkeby',
        signer: uportConnect.SimpleSigner("a0e388225b15ea1fbb0a86547971abc7556049b6d22dc073b7744403e7058e39")
        })
      } catch(err) {
        vows.callback(err, null)
      }
      vows.callback(null, null)
    },
    ' does not throw error ' : function (err, ssid) {
        assert.equal(err, null)
    }
  }}).addBatch({
  'newSsid()' : {
    topic : function () {
      vows = this
      connector.newSsid().then(function (res) {
        tmpSsid = res
        vows.callback(null, res)
      }).catch(function (err) {
        vows.callback(err, null)
      })
    },
    ' returns a proper ssid object though with empty keys' : function (err, ssid) {
        assert.equal(err, null)
        assert.equal(ssid.pubkey, null)
        assert.equal(ssid.privkey, null)
    }
  }}).addBatch({
  'claim()' : {
    topic : function () {
      vows = this
      tmpSsid.pubkey = '0xe042f4b2e271c7c214f8734f4313c7bebb8c519f'
      connector.claim(tmpSsid, {'need':'beer'}).then(function (res) {
        tmpReference = res
        vows.callback(null, res)
      }).catch(function (err) {
        vows.callback(err, null)
      })
    },
    ' returns a reference to the claim ' : function (err, reference) {
        assert.equal(err, null)
        assert.equal(reference, 'need')
        assert.equal(tmpReference, reference)
    }
  }}).addBatch({
  'get()' : {
    topic : function () {
      vows = this
      connector.get(tmpReference).then(function (res) {
        vows.callback(null, res)
      }).catch(function (err) {
        vows.callback(err, null)
      })
    },
    ' returns a result object with the data and a previous reference that equals null' : function (err, res) {
        assert.equal(err, null)
        assert.equal(JSON.stringify(res.data), JSON.stringify({'need':'beer'}))
        assert.equal(res.previous, null)
    }
  }}).addBatch({
  'claim() 2' : {
    topic : function () {
      vows = this
      connector.claim(tmpSsid, {'need':'u'}).then(function (res) {
        tmpReference2 = res
        vows.callback(null, res)
      }).catch(function (err) {
        vows.callback(err, null)
      })
    },
    ' returns a reference to the claim' : function (err, reference) {
        assert.equal(err, null)
        assert.equal(reference, 'need')
        assert.equal(tmpReference2, reference)
    }
  }}).addBatch({
  'get() 2' : {
    topic : function () {
      vows = this
      connector.get(tmpReference2).then(function (res) {
        vows.callback(null, res)
      }).catch(function (err) {
        vows.callback(err, null)
      })
    },
    ' returns a result object with the data and previous null as it should have overwritten the first issued need credential' : function (err, res) {
        assert.equal(err, null)
        assert.equal(JSON.stringify(res.data), JSON.stringify({'need':'u'}))
        assert.equal(res.previous, null)
    }
  }}).addBatch({
  'getLatestClaim()' : {
    topic : function () {
      vows = this
      connector.getLatestClaim(tmpSsid).then(function (res) {
        vows.callback(null, res)
      }).catch(function (err) {
        vows.callback(err, null)
      })
    },
    ' returns null' : function (err, res) {
        assert.equal(err, null)
        assert.equal(res, null)
    }
  }}).addBatch({
  'verify() with same data as first claim made by an ssid given as arguments ' : {
    topic : function () {
      vows = this
      connector.verify(tmpSsid, {'need':'beer'}).then(function (res) {
        vows.callback(null, res)
      }).catch(function (err) {
        vows.callback(err, null)
      })
    },
    ' returns null as the claim got overwritten by the second' : function (err, res) {
        assert.equal(err, null)
        assert.equal(res, null)
    }
  }}).addBatch({
  'verify() with same data as second claim made by an ssid given as arguments ' : {
    topic : function () {
      vows = this
      connector.verify(tmpSsid, {'need':'u'}).then(function (res) {
        vows.callback(null, res)
      }).catch(function (err) {
        vows.callback(err, null)
      })
    },
    ' returns the reference of actually both claims' : function (err, res) {
        assert.equal(err, null)
        assert.equal(res, tmpReference2)
    }
  }}).addBatch({
  'verify() with give data, a given ssid has not claimed yet ' : {
    topic : function () {
      vows = this
      connector.verify(tmpSsid, {'need':'food'}).then(function (res) {
        vows.callback(null, res)
      }).catch(function (err) {
        vows.callback(err, null)
      })
    },
    ' returns null ' : function (err, res) {
        assert.equal(err, null)
        assert.equal(res, null)
    }
  }
}).export(module)
