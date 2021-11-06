const Output = require('Src/Output');

const log = jest.spyOn(console, 'log').mockImplementation(() => {});

/**
 * Notes: In a more sophisticated application, we might set up more formal
 * fixtures for this shared data. For now, we'll just put them here, since
 * there's not a lot.
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
},
{
    'status': 'NO_COUNTRY',
    'original': {
        'street': '345 E Main St',
        'city': 'Anywhere',
        'province': 'OK',
        'postalCode': '12345'
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
        Output.toTerminal(data.slice(0, 3));

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

    it('Gracefully handles other messages', () => {
        /* Other possible response statuses: DELAYED, NO_COUNTRY,
        RATE_LIMIT_EXCEEDED, API_KEY_INVALID_OR_DEPLETED, RESTRICTED,
        INTERNAL_ERROR

        The exact messages at this point are moot, but are still relevant for the user.
        */

        Output.toTerminal([data[3]]);

        expect(log).toHaveBeenCalledWith(`Error: ${data[3].status}`);
    });

    it('Gracefully handles no status', () => {
        Output.toTerminal(['lorem ipsum']);

        // eslint-disable-next-line quotes
        expect(log).toHaveBeenCalledWith("Error: TypeError: Cannot read properties of undefined (reading 'toLowerCase')");
    });

    it('Gracefully handles data that is not an array', () => {
        Output.toTerminal('lorem ipsum');

        // eslint-disable-next-line quotes
        expect(log).toHaveBeenCalledWith("Error: TypeError: Cannot read properties of undefined (reading 'toLowerCase')");
    });
});
