const BaseConnector = require('discipl-core-baseconnector')
const uportConnect = require('uport-connect')

module.exports = class uPortConnector extends BaseConnector {

  constructor() {
    super()
    this.uport = null
  }

  configure(appName, connectionSettings) {
    this.uport = new uportConnect.Connect(appName, connectionSettings)
  }

  getName() {
    return "uport"
  }

  async getSsidOfClaim(reference) {
      return null
  }

  async getLatestClaim(ssid) {
    return null
  }

  async newSsid() {
    return {'pubkey':null, 'privkey':null}
  }

  async claim(ssid, data) {
    let retval = await this.uport.attestCredentials({
      'sub': ssid.pubkey,
      'claim': data
    })
    if(retval == 'ok')
      return Object.keys(data)[0]
    throw Error('Could not attest data')
  }

  async get(reference, ssid = null) {
    let requested = [reference]
    let credentials = null
    let data = null
    try {
      if(reference != null) {
        credentials = await this.uport.requestCredentials({'verified':['need']})
        data = credentials.verified[0].claim
      } else {
        data = await this.uport.requestCredentials({requested:['did'],notifications:true})
      }
    } catch(err) {
      throw Error(err)
    }
    return {'data':data, 'previous':null}
  }

  async verify(ssid, data) {
    let credentialType= Object.keys(data)[0]
    let result = await this.get(credentialType)
    if(JSON.stringify(result.data) == JSON.stringify(data)) {
      return credentialType
    }
    return null
  }

  async subscribe(ssid) {
    return null
  }

}
