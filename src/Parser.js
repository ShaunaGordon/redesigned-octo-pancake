const csvParse = require('csv-parse');
const fs = require('fs-extra');

const Parser = {
    /**
     * Open and read the file to a ReadableStream.
     *
     * @param {string} file
     * @returns Stream
     */
    'read': (file) => {
        return fs.createReadStream(file);
    },

    /**
     * Parse stream input into an object.
     *
     * Notes: In a larger system, we might alter the parsing to better chunk
     * the data, so we don't negate the gains we get from Streams, but that's
     * out of scope right now, so we'll do what we can to make this code clean
     * and simple enough to be easily altered, or have a new parser dropped in
     * to replace it entirely.
     *
     * Columns are an optional parameter used to map CSV columns to a
     * consistent internal structure, making the CSV parsing a bit more
     * flexible in what it can take and not requiring absolute stringincy on
     * column names.
     *
     * @param {Stream} input required
     * @param {array} columns
     * @returns Promise
     */
    'parse': (input, columns) => {
        return new Promise((resolve, reject) => {
            let records = [];

            let parser = input.pipe(csvParse({
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

                /* Disabling eslint for this, because this is the documented best-practice way to handle traversing a Stream, even if it smells a little.
                 */
                // eslint-disable-next-line no-cond-assign
                while (record = parser.read()) {
                    records.push(record);
                }
            })
                .on('error', () => reject('Input is not a valid CSV.'))
                .on('end', () => resolve(records));
        });
    }
};

module.exports = Parser;
