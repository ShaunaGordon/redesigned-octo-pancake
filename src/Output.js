/**
 * Notes: In a more sophisticated application, we might have multiple different
 * ways to output data. In a web application, this class might be the View in
 * an MVC structure, or even the template file for the output page. This
 * functions largely the same way, though is more simplified here.
 */

const connector = '->';

const Output = {
    /**
     * Send the messaging to the terminal.
     *
     * @param {array} data
     */
    'toTerminal': (data) => {
        /* Notes: In a bigger system, we might want/need more robust handling
        of whether the date comes in as part of an array, but such measures are
        rather out of scope, so we're just doing a little adjustment to attempt
        to handle it gracefully. Ideally, the contents of this block don't get
        hit anyway, because of safeguards in the rest of the code.
        */
        if(!Array.isArray(data)) {
            data = [data];
        }
        data.forEach((item) => {
            let formatted;
            try {
                let status = item.status.toLowerCase();
                formatted = Output[status](item);
            } catch(e) {
                /* If we get an error at this point, it's typically a non-fatal
                error, so we can fail it gracefully as part of the output
                message and just continue on.

                Depending on needs, this can easily be switched to outputting
                to console.error instead of or in addition to the normal output.
                 */
                formatted = Output.error(item.status || e);
            } finally {
                console.log(formatted);
            }
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
     * Format the "Valid Address" messaging.
     *
     * @param {object} data
     * @returns String
     */
    'valid': (data) => {
        let original = Object.values(data.original).join(', ');
        let corrected = Object.values(data.corrected).join(', ');

        return `${original} ${connector} ${corrected}`;
    },

    /**
     * Format the "Valid Address, Correction" messaging.
     *
     * For our purposes, "Suspect" and "Valid" are functionally the same, so
     * we'll pass it through.
     *
     * @param {object} data
     * @returns String
     */
    'suspect': (data) => {
        return Output.valid(data);
    },

    /**
     * Anything else is an error, very likely from the API.
     *
     * @param {object} data
     * @returns String
     */
    'error': (message) => {
        return `Error: ${message}`;
    }
};

module.exports = Output;
