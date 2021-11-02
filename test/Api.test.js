const api = require('Src/Api');

// Jest docs actually discuss node-fetch, specifically
// https://jestjs.io/docs/bypassing-module-mocks
jest.mock('node-fetch');
const fetch = require('node-fetch');
const {Response} = jest.requireActual('node-fetch');

const input = [{
    'street': '',
    'city': '',
    'postalCode': ''
},
{
    'street': '',
    'city': '',
    'postalCode': ''
}];

const expectedBody = [{
    'StreetAddress': input[0].street,
    'City': input[0].city,
    'PostalCode': input[0].postalCode,
    'CountryCode': input[0].country,
},
{
    'StreetAddress': input[1].street,
    'City': input[1].city,
    'PostalCode': input[1].postalCode,
    'CountryCode': input[1].country,
}];

const expectedApiResult = [
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

const expectedNormalized = [{
    'status': expectedApiResult[0].status,
    'original': {
        'street': '',
        'city': '',
        'postalCode': ''
    },
    'corrected': {
        'street': expectedApiResult[0].street,
        'city': expectedApiResult[0].city,
        'postalCode': expectedApiResult[0].postalcode,
    }
},
{
    'status': expectedApiResult[1].status,
    'original': {
        'street': '',
        'city': '',
        'postalCode': ''
    },
    'corrected': {
        'street': expectedApiResult[1].street,
        'city': expectedApiResult[1].city,
        'postalCode': expectedApiResult[1].postalcode,
    }
}];

describe('Api.send', () => {
    afterEach(() => {
        fetch.mockReset();
    });

    it('Gets a result from the API', async () => {

        const responseString = JSON.stringify(expectedApiResult[0]);

        fetch.mockReturnValue(Promise.resolve(new Response(responseString)));

        const actual = await (await api.sendItem(input[0])).json();

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('https://api.address-validator.net/api/verify?APIKey=undefined', {
            'method': 'POST',
            'body': JSON.stringify(expectedBody[0]),
            'headers': {'Content-Type': 'application/json'}
        });

        expect(actual).toEqual(expect.objectContaining(expectedApiResult[0]));
    });

    it('Takes multiple addresses and gets results for all of them', async () => {
        fetch.mockReturnValueOnce(Promise.resolve(new Response(JSON.stringify(expectedApiResult[0]))))
            .mockReturnValueOnce(Promise.resolve(new Response(JSON.stringify(expectedApiResult[1]))));

        const actual = await api.send(input);

        expect(fetch).toHaveBeenCalledTimes(2);
        expect(fetch).toHaveBeenCalledWith('https://api.address-validator.net/api/verify?APIKey=undefined', {
            'method': 'POST',
            'body': JSON.stringify(expectedBody[0]),
            'headers': {'Content-Type': 'application/json'}
        });

        expect(fetch).toHaveBeenCalledWith('https://api.address-validator.net/api/verify?APIKey=undefined', {
            'method': 'POST',
            'body': JSON.stringify(expectedBody[1]),
            'headers': {'Content-Type': 'application/json'}
        });

        expect(actual[1]).toEqual(expectedNormalized[1]);
        expect(actual).toEqual(expect.arrayContaining(expectedNormalized));
    });
});

describe('Api.normalize', () => {
    it('Normalizes the results', async () => {
        const result = Promise.resolve(expectedApiResult[0]);

        const actual = await api.normalize(input[0], result);

        expect(actual).toStrictEqual(expectedNormalized[0]);
    });
});
