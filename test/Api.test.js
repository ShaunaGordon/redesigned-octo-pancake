const api = require('Src/Api.js');

// Jest docs actually discuss node-fetch, specifically
// https://jestjs.io/docs/bypassing-module-mocks
jest.mock('node-fetch');
const fetch = require('node-fetch');
const {Response} = jest.requireActual('node-fetch');

describe('Api', () => {
    afterEach(() => {
        fetch.mockReset();
    });

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

        const actual = await (await api.sendItem(data)).json();

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('https://api.address-validator.net/api/verify?APIKey=undefined', {
            'method': 'POST',
            'body': expectedBody
        });

        expect(actual).toEqual(expect.objectContaining(expectedResult));
    });

    it('Takes multiple addresses and gets results for all of them', async () => {
        const expectedResponse = [
            {
                'status': 'VALID',
                'street': '123 E Main St',
                'city': 'Anywhere',
                'postalcode': '43210-1234',
            },
            {
                'status': 'VALID',
                'street': '345 E Main St',
                'city': 'Anywhere',
                'postalcode': '43210-1234',
            }
        ];

        const expectedResult = [{
            'status': 'VALID',
            'original': {
                'street': '',
                'city': '',
                'postalCode': '',
                'country': ''
            },
            'corrected': {
                'street': '123 E Main St',
                'city': 'Anywhere',
                'postalCode': '43210-1234',
            }
        },
        {
            'status': 'VALID',
            'original': {
                'street': '',
                'city': '',
                'postalCode': '',
                'country': ''
            },
            'corrected': {
                'street': '345 E Main St',
                'city': 'Anywhere',
                'postalCode': '43210-1234',
            }
        }
        ];

        const data = [{
            'street': '',
            'city': '',
            'postalCode': '',
            'country': ''
        },
        {
            'street': '',
            'city': '',
            'postalCode': '',
            'country': ''
        }
        ];

        const expectedBody = [{
            'StreetAddress': data[0].street,
            'City': data[0].city,
            'PostalCode': data[0].postalCode,
            'CountryCode': data[0].country,
        },
        {
            'StreetAddress': data[1].street,
            'City': data[1].city,
            'PostalCode': data[1].postalCode,
            'CountryCode': data[1].country,
        }];

        fetch.mockReturnValueOnce(Promise.resolve(new Response(JSON.stringify(expectedResponse[0]))))
            .mockReturnValueOnce(Promise.resolve(new Response(JSON.stringify(expectedResponse[1]))));

        const actual = await api.send(data);

        expect(fetch).toHaveBeenCalledTimes(2);
        expect(fetch).toHaveBeenCalledWith('https://api.address-validator.net/api/verify?APIKey=undefined', {
            'method': 'POST',
            'body': expectedBody[0]
        });

        expect(fetch).toHaveBeenCalledWith('https://api.address-validator.net/api/verify?APIKey=undefined', {
            'method': 'POST',
            'body': expectedBody[1]
        });

        expect(actual[1]).toEqual(expectedResult[1]);
        expect(actual).toEqual(expect.arrayContaining(expectedResult));
    });

    it('Normalizes the results', async () => {
        const data = {
            'status': 'VALID',
            'formattedaddress': '123 E Main St, Anywhere, OH, 43210-1234',
            'street': '123 E Main St',
            'postalcode': '43210-1234',
            'city': 'Anywhere',
            'state': 'OH',
            'country': 'US',
            'rdi': 'Residential'
        };
        const result = Promise.resolve(data);

        const input = {
            'street': '',
            'city': '',
            'postalCode': ''
        };

        const expected = {
            'status': data.status,
            'original': input,
            'corrected': {
                'street': data.street,
                'city': data.city,
                'postalCode': data.postalcode
            }
        };

        const actual = await api.normalize(input, result);

        expect(actual).toStrictEqual(expected);
    });
});
