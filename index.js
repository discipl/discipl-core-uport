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
    let predicates = [reference]
    let credentials = null
    try {
      if(reference != null) {
        //console.log('retrieving:'+JSON.stringify({verified:predicates}))
        credentials = await this.uport.requestCredentials({verified:predicates})
      } else {
        //console.log('retrieving profile')
        credentials = await this.uport.requestCredentials({notifications:true})
      }
    } catch(err) {
      throw Error(err)
    }
    //console.log("Credentials:"+Object.keys(credentials)+' verified:'+credentials.verified)
    let data = credentials.verified
    return {'data':data, 'previous':null}
  }

  async verify(ssid, data) {
    let credentialType= Object.keys(data)[0]
    let result = await this.get(credentialType)
    if(result.data == data) {
      return credentialType
    }
    return null
  }

  async subscribe(ssid) {
    return null
  }

}
