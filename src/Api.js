/**
 * Notes: In a larger application, this might get split into a folder and each API have its own file, with this becoming Api->AddressValidator or something. However, at this point, going that full way is overkill and violates YAGNI, though we can strike a reasonable balance, and do things like not hardcode the base URL in the code itself and encapsulate the service-specific things, allowing us the ability to drop in a delegation object, should the need arise.
 *
 * Additionally, address-validator.net has a bulk verification endpoint. Ideally, we'd use that instead, since it saves API calls, which is what we appear to be charged by. However, this requires a server to listen for the HTTP callbacks, which is out of scope for this right now.
 *
 * We also end up breaking a lot of the gains from Streams at this point, but they start getting really hairy when dealing with arrays of data, especially since we're not using the bulk verification. For simplicity's sake, we're opting to switch to synchronous at this point here, but in a more full application, we'd do what we can to preserve Streams for the aforementioned benefits.
 */

const fetch = require('node-fetch');

const apiKey = process.env.ADDRESS_KEY;
const baseUrl = 'https://api.address-validator.net';
const endpoints = {
    'verify': '/api/verify'
};

const Api = {
    /**
     * Send data for a single item to the API.
     *
     * @param {object} data
     * @returns
     */
    'sendItem': async (data) => {
        let input = {
            'StreetAddress': data.street,
            'City': data.city,
            'State': data.province,
            'PostalCode': data.postalCode,
            'CountryCode': data.country,
        };

        let endpoint = `${baseUrl}${endpoints.verify}?APIKey=${apiKey}`;

        return fetch(endpoint, {
            'method': 'POST',
            'body': JSON.stringify(input),
            'headers': {'Content-Type': 'application/json'}
        }).then((result) => {
            return result.clone();
        }).catch((err) => {
            console.error(err);
        });
    },

    /**
     * Send data for a set of items to the API.
     *
     * Notes: The rest of the application shouldn't really care about how this sends the data, just *that* it sends it. So, we'll standardize on using an array, so that if/when we have a bulk option, it can be handled internally.
     *
     * @param {array} data
     */
    'send': async (data) => {
        let response = await Promise.all(data.map(item => Api.sendItem(item)));

        return await Promise.all((response).map(async (result, index) => Api.normalize(data[index], result.json())));
    },

    /**
     * Normalizes the return value to the internal standard so that we encapsulate the particulars of the API.
     *
     * @param {object} input
     * @param {object} result
     */
    'normalize': async (input, result) => {
        result = await result;

        return {
            'status': result.status,
            'original': input,
            'corrected': {
                'street': result.street,
                'city': result.city,
                'postalCode': result.postalcode
            }
        };
    }
};

module.exports = Api;
