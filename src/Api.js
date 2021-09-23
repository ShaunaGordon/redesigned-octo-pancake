/**
 * Notes: In a larger application, this might get split into a folder and each API have its own file, with this becoming Api->AddressValidator or something. However, at this point, going that full way is overkill and violates YAGNI, though we can strike a reasonable balance, and do things like not hardcode the base URL in the code itself and encapsulate the service-specific things, allowing us the ability to drop in a delegation object, should the need arise.
 *
 * Additionally, address-validator.net has a bulk verification endpoint. Ideally, we'd use that instead, since it saves API calls, which is what we appear to be charged by. However, this requires a server to listen for the HTTP callbacks, which is out of scope for this right now.
 */

const fetch = require('node-fetch');

// Move to .env?
const baseUrl = 'https://api.address-validator.net';

const Api = {
    'send': (data) => {
        let input = {
            'APIKey': '',
            'StreetAddress': data.street,
            'City': data.city,
            'State': data.province,
            'PostalCode': data.postalCode,
            'CountryCode': data.country,
        };

        let endpoint = `${baseUrl}/api/verify`;
        return fetch(endpoint, {
            'method': 'POST',
            'body': input
        }).then((result) => {
            return result.text();
        });
    },
};

module.exports = Api;
