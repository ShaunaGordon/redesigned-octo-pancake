/**
 * Notes: In a more sophisticated application, we might have multiple different ways to output data. In a web application, this class might be the View in an MVC structure, or even the template file for the output page. This functions largely the same way, though is more simplified here.
 */

const connector = '->';

const Output = {
    /**
     * Send the messaging to the terminal.
     *
     * @param {array} data
     */
    'toTerminal': (data) => {
        data.forEach((item) => {
            let status = item.status.toLowerCase();
            let formatted = Output[status](item);
            console.log(formatted);
        });
    },
    /**
     * Format the "Invalid Address" messaging.
     *
     * @param {object} data
     */
    'invalid': (data) => {
        let address = Object.values(data.original).join(', ');

        return `${address} ${connector} Invalid Address`;
    },

    /**
     * Format the "Valid Address, Correction" messaging.
     *
     * @param {object} data
     */
    'valid': (data) => {
        let original = Object.values(data.original).join(', ');
        let corrected = Object.values(data.corrected).join(', ');

        return `${original} ${connector} ${corrected}`;
    }
};

module.exports = Output;
