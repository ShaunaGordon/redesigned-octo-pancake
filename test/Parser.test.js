const Parser = require('../src/Parser');
const {Buffer} = require('buffer');
const stream = require('stream');

let data;

let expectedInput =
`Street Address, City, Postal Code
123 e Maine Street, Columbus, 43215
1 Empora St, Title, 11111
`;

describe('Parser.parse', () => {
    beforeAll(() => {
        data = stream.Readable();
        data.push(expectedInput);
        data.push(null);
    });

    it('Parses Stream input into objects', async () => {
        let columns = [
            'street',
            'city',
            'postalCode'
        ];

        let expected = [
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

        Parser.parse(data, columns)
            .then((actual) => {
                expect(actual).toStrictEqual(expected);
            });
    });

    it('Uses implicit columns if none are supplied', async () => {
        let expected = [
            {
                'Street Address': '123 e Maine Street',
                'City': 'Columbus',
                'Postal Code': '43215'
            },
            {
                'Street Address': '1 Empora St',
                'City': 'Title',
                'Postal Code': '11111'
            }
        ];

        Parser.parse(data)
            .then((actual) => {
                expect(actual).toStrictEqual(expected);
            });
    });
});

describe('Parser.read', () => {
    it('Returns a Stream', () => {
        let filename = 'test/input.csv';
        let actual = Parser.read(filename);

        expect(actual).toBeTruthy();
        // JS doesn't have typing beyond primitives, so we'll do a little manual duck-typing
        // Quack, quack
        expect(actual.read).not.toBeUndefined();
    });

    it('Reads the file data into the Stream', async () => {
        let filename = 'test/input.csv';
        let response = Parser.read(filename);
        let chunks = [];

        for await (let chunk of response) {
            chunks.push(chunk);
        }

        const buffer = Buffer.concat(chunks);
        const actual = buffer.toString('utf-8');

        expect(actual).toBe(expectedInput);
    });
});
