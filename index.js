/**
 * Notes: Node uses an entry file to get into its applications. The exact form the entry file takes depends a lot on the application, but I like using it as a sort of controller in console programs, especially when using a library to manage the commands ("don't test code you don't own"). It also helps me avoid putting too much logic code where it doesn't belong, to keep the code clean and readable.
 */

/**
 * Notes: Node/JS convention prefers system level environment variables, but in development, that can cause naming collisions between projects. So we use dotenv to stick project config info into process.env, so we can use it throughout our application whenever env info is needed.
 */
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const Parser = require('./src/Parser');

/**
 * Use Commander.js to create the app's commands and triggers.
 *
 * This gives us all the options and switches for "free."
 *
 * Provides command based usage, similar to Jest or Git.
 *
 * Notes: While it's a bit overkill for features as defined, Commander really shines with more sophisticated command line applications. Adding commands and subcommands is extremely easy and easy to read. (If you want examples of this expanded out, feel free to ask.)
 */
const program = require('commander');

/**
  * Set the version information from package.json.
  *
  * Default version flag is -V, so we're passing in the flags
  * that are more consistent with JS CLI apps.
  */
program.version('1.0', '-v, --version');

/***************
  * Commands
  **************/

/**
  * Program entrypoint
  *
  * Should allow for `cat file.csv | node app` and `node app file.csv` input.
  */
program
    .argument('[file]', 'data to process')
    .action((file) => {
        let data = process.stdin;
        if(file) {
            // read file into stream (createReadStream)
            data = Parser.read(file); // Stream
        }
        // process stream
        Parser.parse(data);
    });

/**
 * Tell Commander to respond to input.
 */
program.parse(process.argv || process.stdin);
