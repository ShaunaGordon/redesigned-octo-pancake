const Parser = require('../src/Parser.js');

describe('Parser', () => {
    it('Parses Stream input into objects', async () => {
        let data = `Street Address, City, Postal Code
        123 e Maine Street, Columbus, 43215
        1 Empora St, Title, 11111`;

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

        let actual = await Parser.parse(data, columns);

        expect(actual).toStrictEqual(expected);
    });

    it('Uses implicit columns if no columns are supplied', async () => {
        let data = `Street Address, City, Postal Code
        123 e Maine Street, Columbus, 43215
        1 Empora St, Title, 11111`;

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

        let actual = await Parser.parse(data);

        expect(actual).toStrictEqual(expected);
    });
});
