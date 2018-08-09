# discipl-core-uport

Discipl Core Connector implementation for utilizing uPort to issue and verify ownership of signed claims in a given uport wallet (linked to an uport user)

We will use uport-connect to implement the base connector api with the following specifics:

- getName : returns 'uport'
- newSsid : returns an empty ssid. Note the issuer should set it's uport-connect connectionSettings through a configure() method. The ssid is used to indicate the ssid of the subject in whoms channel you push an attested claim.
- claim   : issues a credential with specific data (in the uPort wallet that accepts this request) and returns the credential type (actually the attestation predicate), thus for instance 'HasPermitX' ... The given data (JSON) is expected to have a predicate as first label and is what is used as uPort credential type. ssid should have a public key set to the wallet owners uport id (which you can fetch with a call to get() with no arguments)
- get     : get the data of the given verified credential type as reference from a uPort wallet that accepts this request. If credential type is null gets the full profile (a schema.org Person as json) of the - uport user.
           previous is always null. Only the latest credential with a certain predicate is retrieved. Older ones are ignored.
- verify  : verifies existence of a credential (of the type indicated in the first label found in the given JSON data, being the the predicate) with the given data (the value of the predicate as label) and returns the credential type as reference. Simplified implementation of the implementation of this method in BaseConnector as there's no real channel to iterate. Only the latest credential of a type is verified.

note because of you could see that a temporarily presented anonymous uPort wallet is what is being used as platform to store and retrieve single claims from and there's no way to iterate claims in it:
- getLatestClaim : returns null, do not use
- getSsidOfClaim : returns null, do not use
- subscribe      : returns null, do not use

Note that revocation functionality of discipl core on claims stored through this connector does not work as we do not include the MNID of the uPort user in any references to prevent misuse.

# Status:

tests succeed

# Requirements for testing:

you need to download the uport app (prerelease) and create / set your uport identity. Doing a `npm.test` will show you a QR code in the terminal which you can scan. All tests will then use push notifications
and will succeed if you accept at evry notification you get in your uport app
