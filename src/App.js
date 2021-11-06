/**
 * Notes: If index.js is effectively our router, this is the controller. If there were more commands to be run, then they'd be in here (and, depending on needs, other similar files), too, where they'd oversee the different parts and knit all the tasks together.
 */

const Api = require('./Api');
const Output = require('./Output');
const Parser = require('./Parser');

const App = {
    /**
     * Run the application.
     *
     * @param {Stream} data
     */
    'run': async (data) => {
        let columns = [
            'street',
            'city',
            'postalCode'
        ];
        await Parser.parse(data, columns)
            .then((addresses) => {
                Api.send(addresses)
                    .then(async (results) => {
                        Output.toTerminal(await results);
                    }).catch(e => console.error(e));
            }).catch(e => console.error(e));
    }
};

module.exports = App;
