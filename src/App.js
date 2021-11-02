const Api = require('./Api');
const Output = require('./Output');
const Parser = require('./Parser');

const App = {
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
