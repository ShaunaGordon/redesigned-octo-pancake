const parse = require('csv-parse');
const fs = require('fs-extra');

const Parser = {
    'read': (file) => {
        return fs.createReadStream(file);
    },
    'parse': (input, columns) => {
        return new Promise((resolve, reject) => {
            let records = [];

            let parser = input.pipe(parse({
                'delimiter': ',',
                'columns': (header) => {
                    if(columns) {
                        return header.map((column, index) => columns[index]);
                    }
                    return header;
                },
                'skip_empty_lines': true,
                'trim': true
            })).on('readable', () => {
                let record;
                // eslint-disable-next-line no-cond-assign
                while (record = parser.read()) {
                    records.push(record);
                }
            })
                .on('error', (err) => reject(err))
                .on('end', () => resolve(records));
        });
    }
};

module.exports = Parser;
