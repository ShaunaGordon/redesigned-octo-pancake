const Output = require('Src/Output');

const log = jest.spyOn(console, 'log').mockImplementation(() => {});

/**
 * Notes: In a more sophisticated application, we might set up more formal fixtures for this shared data. For now,
 */
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
},
{
    'status': 'SUSPECT',
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
    '345 E Main St, Anywhere, OK, 12345 -> 345 E Main St., Anywhere, OK, 12345-6789',
    '345 E Main St, Anywhere, OK, 12345 -> 345 E Main St., Anywhere, OK, 12345-6789'
];

describe('Output', () => {
    afterEach(() => {
        log.mockReset();
    });

    it('Outputs the message response to terminal', () => {
        Output.toTerminal([data[0]]);

        expect(log).toHaveBeenCalledTimes(1);
        expect(log).toHaveBeenCalledWith(expected[0]);
    });

    it('Outputs multiple message responses to terminal', () => {
        Output.toTerminal(data);

        expect(log).toHaveBeenCalledTimes(3);
        expect(log).toHaveBeenCalledWith(expected[0]);
        expect(log).toHaveBeenCalledWith(expected[1]);
        expect(log).toHaveBeenCalledWith(expected[2]);
    });

    it('Returns valid address message', () => {
        let actual = Output.valid(data[1]);

        expect(actual).toBe(expected[1]);
    });

    it('Returns valid address message for "suspect" address', () => {
        let actual = Output.valid(data[2]);

        expect(actual).toBe(expected[2]);
    });
});
