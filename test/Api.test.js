const api = require('Src/Api.js');

// Jest docs actually discuss node-fetch, specifically
// https://jestjs.io/docs/bypassing-module-mocks
jest.mock('node-fetch');
const fetch = require('node-fetch');
const {Response} = jest.requireActual('node-fetch');

describe('Api', () => {
    it('Gets a result from the API', async () => {
        const expectedResult = {
            'status': 'VALID',
            'formattedaddress': '123 E Main St, Anywhere, OH, 43210-1234',
            'street': '123 E Main St',
            'postalcode': '43210-1234',
            'city': 'Anywhere',
            'state': 'OH',
            'country': 'US',
            'rdi': 'Residential'
        };

        const data = {
            'street': '',
            'city': '',
            'province': '',
            'postalCode': '',
            'country': ''
        };

        const expectedBody = {
            'APIKey': '',
            'StreetAddress': data.street,
            'City': data.city,
            'State': data.province,
            'PostalCode': data.postalCode,
            'CountryCode': data.country,
        };
        const responseString = JSON.stringify(expectedResult);

        fetch.mockReturnValue(Promise.resolve(new Response(responseString)));

        const actual = JSON.parse(await api.send(data));

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('https://api.address-validator.net/api/verify', {
            'method': 'POST',
            'body': expectedBody
        });

        expect(actual).toStrictEqual(expectedResult);
    });
});
