
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
    uport.attestCredentials({
      sub: data.sub,
      claim: data.data,
    })
  }

  async get(reference, ssid = null) {
    if(reference) {
      return this.uport.requestCredentials({verified:reference})
    }
    return this.uport.requestCredentials()
  }

  async verify(ssid, data) {
    let credentialType= Object.keys(data)[0]
    let result = await this.get(credentialType)
    if(result == data) {
      return credentialType
    }
    return null
  }

  async subscribe(ssid) {
    return null
  }

}
