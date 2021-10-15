const Output = require('Src/Output.js');

const log = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('Output', () => {
    afterEach(() => {
        log.mockReset();
    });

    it('Outputs the message response to terminal', () => {
        const data = [{
            'status': 'INVALID',
            'original': {
                'street': '123 E Main St',
                'city': 'Anywhere',
                'province': 'OK',
                'postalCode': '12345'
            }
        }];

        const expected = '123 E Main St, Anywhere, OK, 12345 -> Invalid Address';

        Output.toTerminal(data);

        expect(log).toHaveBeenCalledTimes(1);
        expect(log).toHaveBeenCalledWith(expected);
    });

    it('Outputs multiple message responses to terminal', () => {
        const data = [{
            'status': 'INVALID',
            'original': {
                'street': '123 E Main St',
                'city': 'Anywhere',
                'province': 'OK',
                'postalCode': '12345'
            }
        },
        {
            'status': 'VALID',
            'original': {
                'street': '345 E Main St',
                'city': 'Anywhere',
                'province': 'OK',
                'postalCode': '12345'
            },
            'corrected': {
                'street': '345 E Main St.',
                'city': 'Anywhere',
                'province': 'OK',
                'postalCode': '12345-6789'
            }
        }];

        const expected = [
            '123 E Main St, Anywhere, OK, 12345 -> Invalid Address',
            '345 E Main St, Anywhere, OK, 12345 -> 345 E Main St., Anywhere, OK, 12345-6789'
        ];

        Output.toTerminal(data);

        expect(log).toHaveBeenCalledTimes(2);
        expect(log).toHaveBeenCalledWith(expected[0]);
        expect(log).toHaveBeenCalledWith(expected[1]);
    });

    it('Returns invalid address message', () => {
        const data = {
            'original': {
                'street': '123 E Main St',
                'city': 'Anywhere',
                'province': 'OK',
                'postalCode': '12345'
            }
        };

        const expected = '123 E Main St, Anywhere, OK, 12345 -> Invalid Address';

        let actual = Output.invalid(data);

        expect(actual).toBe(expected);
    });

    it('Returns valid address message', () => {
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

        let actual = Output.valid(data);

        expect(actual).toBe(expected);
    });
});
