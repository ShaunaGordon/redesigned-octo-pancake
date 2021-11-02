const app = require('Src/App');
const Parser = require('Src/Parser');
const Api = require('Src/Api');
const Output = require('Src/Output');
const stream = require('stream');

const log = jest.spyOn(console, 'log').mockImplementation(() => {});
jest.mock('Src/Parser');
jest.mock('Src/Api');
jest.mock('Src/Output');

let data;

const expectedInput =
`Street Address, City, Postal Code
123 e Maine Street, Columbus, 43215
1 Empora St, Title, 11111
`;

const expectedParsedValue = [
    {
        'street': '123 e Maine Street',
        'city': 'Columbus',
        'postalCode': '43215'
    },
    {
        'street': '1 Empora St',
        'city': 'Title',
        'postalCode': '11111'
    }
];

const expectedApiResponse = [{
    'status': 'VALID',
    'original': {
        'street': expectedParsedValue[0].street,
        'city': expectedParsedValue[0].city,
        'postalCode': expectedParsedValue[0].postalCode
    },
    'corrected': {
        'street': expectedParsedValue[0].street,
        'city': expectedParsedValue[0].city,
        'postalCode': expectedParsedValue[0].postalCode
    }
},
{
    'status': 'VALID',
    'original': {
        'street': expectedParsedValue[1].street,
        'city': expectedParsedValue[1].city,
        'postalCode': expectedParsedValue[1].postalCode
    },
    'corrected': {
        'street': expectedParsedValue[1].street,
        'city': expectedParsedValue[1].city,
        'postalCode': expectedParsedValue[1].postalCode
    }
}];

describe('App', () => {
    beforeAll(() => {
        data = stream.Readable();
        data.push(expectedInput);
        data.push(null);

        Parser.parse.mockResolvedValue(expectedParsedValue);
        Api.send.mockResolvedValue(expectedApiResponse);
    });

    afterEach(() => {
        log.mockReset();
    });

    it('successfully runs', async () => {
        await app.run(data);

        expect(Parser.parse).toHaveBeenCalled();
        expect(Api.send).toHaveBeenCalled();
        expect(Output.toTerminal).toHaveBeenCalled();
    });
});
