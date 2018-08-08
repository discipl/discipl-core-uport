# discipl-core-uport

Discipl Core Connector implementation for utilizing uPort to issue and verify ownership of signed claims in a given uport wallet (linked to an uport user)

We will use uport-connect to implement the base connector api with the following specifics:

- getName : returns 'uport'
- newSsid : returns an empty ssid in which an issuer needs to set it's public and private key themselves that have been created using the uport App Manager
- claim   : issues a credential with specific data (in the uPort wallet that accepts this request) and returns the credential type (actually the attestation predicate), thus for instance 'HasPermitX' ... The given data (JSON) is expected to have a predicate as first label and is what is used as uPort credential type.
- get     : get the data of the given credential type as reference from a uPort wallet that accepts this request. If credential type is null gets the full profile (a schema.org Person as json) of the - uport user. Note that because of absence of iterating claims in the wallet: previous is always null.
- verify  : verifies existence of a credential (of the type indicated in the first label found in the given JSON data, being the the predicate) with the given data (the value of the predicate as label) and returns the credential type as reference. Simplified implementation of the implementation of this method in BaseConnector as there's no channel to iterate

note because of you could see that a temporarily presented anonymous uPort wallet is what is being used as platform to store and retrieve single claims from and there's no way to iterate claims in it:
- getLatestClaim : returns null, do not use
- getSsidOfClaim : returns null, do not use
- subscribe      : returns null, do not use

Note that revocation functionality of discipl core on claims stored through this connector does not work as we do not include the MNID of the uPort user in any references to prevent misuse.

Work in progress
