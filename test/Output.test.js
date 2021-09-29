const Output = require('Src/Output.js');

const log = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('Output', () => {
    afterEach(() => {
        log.mockReset();
    });

    it('Outputs invalid address response', () => {
        const data = {
            'original': {
                'street': '123 E Main St',
                'city': 'Anywhere',
                'province': 'OK',
                'postalCode': '12345'
            }
        };

        const expected = '123 E Main St, Anywhere, OK, 12345 -> Invalid Address';

        Output.invalid(data);

        expect(log).toHaveBeenCalledTimes(1);
        expect(log).toHaveBeenCalledWith(expected);
    });

    it('Outputs valid address response', () => {
        const data = {
            'original': {
                'street': '123 E Main St',
                'city': 'Anywhere',
                'province': 'OK',
                'postalCode': '12345'
            },
            'corrected': {
                'street': '123 E Main St.',
                'city': 'Anywhere',
                'province': 'OK',
                'postalCode': '12345-6789'
            }
        };

        const expected = '123 E Main St, Anywhere, OK, 12345 -> 123 E Main St., Anywhere, OK, 12345-6789';

        Output.valid(data);

        expect(log).toHaveBeenCalledTimes(1);
        expect(log).toHaveBeenCalledWith(expected);
    });
});
