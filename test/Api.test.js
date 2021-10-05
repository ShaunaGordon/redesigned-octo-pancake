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
            'postalCode': '',
            'country': ''
        };

        const expectedBody = {
            'StreetAddress': data.street,
            'City': data.city,
            'PostalCode': data.postalCode,
            'CountryCode': data.country,
        };
        const responseString = JSON.stringify(expectedResult);

        fetch.mockReturnValue(Promise.resolve(new Response(responseString)));

        const actual = await api.send(data);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('https://api.address-validator.net/api/verify', {
            'method': 'POST',
            'body': expectedBody
        });

        expect(actual).toEqual(expect.objectContaining(expectedResult));
    });
});
