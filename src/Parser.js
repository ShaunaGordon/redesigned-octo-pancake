/**
 * Notes: In a more sophisticated application, I'd use async and utilize streams to better handle larger files. (I'd also be looking at batching and sending to the bulk endpoint and not the individual address one).
 */
const parse = require('csv-parse/lib/sync');

const Parser = {
    'parse': (input, columns) => {
        let records = parse(input, {
            'delimiter': ',',
            'columns': (header) => {
                if(columns) {
                    return header.map((column, index) => columns[index]);
                }
                return header;
            },
            'skip_empty_lines': true,
            'trim': true
        });

        return records;
    }
};

module.exports = Parser;
