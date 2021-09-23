const Output = require('Src/Output.js');

const log = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('Output', () => {
    it('Outputs invalid address response', () => {
        const data = {
            'street': '123 E Main St',
            'city': 'Anywhere',
            'province': 'OK',
            'postalCode': '1234'
        };

        const expected = '123 E Main St, Anywhere, OK, 1234 -> Invalid Address';

        Output.invalid(data);

        expect(log).toHaveBeenCalledTimes(1);
        expect(log).toHaveBeenCalledWith(expected);
    });

    it.todo('Outputs valid address response');

    it.todo('Outputs a suggestion for suspect responses');
});
