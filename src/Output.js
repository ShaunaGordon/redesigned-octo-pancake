/**
 * Notes: In a more sophisticated application, we might have multiple different ways to output data. In a web application, this class might be the View in an MVC structure, or even the template file for the output page. This functions largely the same way, though is more simplified here.
 */

const connector = '->';

const outputToTerminal = (data) => {
    console.log(data);
};

const Output = {
    'invalid': (data) => {
        let address = Object.values(data).join(', ');

        outputToTerminal(`${address} ${connector} Invalid Address`);
    },

    'valid': (data) => {
        // address -> suggestion
    }
};

module.exports = Output;
