/**
 * Notes: In a more sophisticated application, we might have multiple different ways to output data. In a web application, this class might be the View in an MVC structure, or even the template file for the output page. This functions largely the same way, though is more simplified here.
 */

const connector = '->';

const outputToTerminal = (data) => {
    console.log(data);
};

const Output = {
    /**
     * Output "Invalid Address" messaging to terminal.
     *
     * @param {object} data
     */
    'invalid': (data) => {
        let address = Object.values(data.original).join(', ');

        outputToTerminal(`${address} ${connector} Invalid Address`);
    },

    /**
     * Output "Valid Address, Correction" messaging to terminal.
     *
     * @param {object} data
     */
    'valid': (data) => {
        let original = Object.values(data.original).join(', ');
        let corrected = Object.values(data.corrected).join(', ');

        outputToTerminal(`${original} ${connector} ${corrected}`);
    }
};

module.exports = Output;
