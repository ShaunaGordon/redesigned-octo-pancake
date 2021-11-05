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

    it('Gracefully rejects non-csv files', () => {
        let input = `
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus bibendum lacus a nisi rhoncus, vel sollicitudin dolor iaculis. Vivamus ut nibh hendrerit, iaculis nunc sed, ornare elit. Suspendisse in commodo sapien. Suspendisse gravida purus et nisi mollis pharetra. Nullam feugiat porta risus viverra tincidunt. Aenean quis nulla non odio imperdiet fringilla vitae et massa. Etiam tincidunt, turpis et vulputate vulputate, ante ante sodales ante, id ullamcorper ligula velit eu quam. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.

        Donec facilisis ac dolor dignissim laoreet. Nulla gravida sagittis felis, quis interdum massa bibendum quis. Pellentesque vitae nunc eros. Nullam ut eleifend ligula. Aliquam finibus velit nisi, id cursus enim dictum id. Cras id metus sed mi feugiat commodo. Fusce tempor diam nec vestibulum eleifend. Quisque velit dolor, pellentesque non ante in, auctor dignissim elit. Donec vulputate justo mauris, a viverra eros faucibus sit amet. Mauris facilisis est ac tortor viverra, eu rhoncus est hendrerit. Mauris magna odio, tincidunt et felis nec, auctor vehicula magna. Vivamus eu finibus lectus. Vestibulum facilisis, lorem et scelerisque feugiat, eros quam pharetra arcu, nec sodales urna mi sed nulla. In iaculis hendrerit mollis. Fusce pellentesque nisl nulla, pellentesque pharetra dui eleifend non.`;
        let invalid = stream.Readable();
        invalid.push(input);
        invalid.push(null);

        return expect(Parser.parse(invalid)).rejects.toMatch('Input is not a valid CSV.');
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
