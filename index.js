import { Command } from 'commander';

let workingDir = process.cwd();

/**
 * Use Commander.js to create the app's commands and triggers.
 *
 * This gives us all the options and switches for "free."
 *
 * Provides command based usage, similar to Jest or Git.
 *
 * Notes: While it's a bit overkill for features as defined, Commander really shines with more sophisticated command line applications. Adding commands and subcommands is extremely easy and easy to read. (If you want examples of this expanded out, feel free to ask.)
 */
 const program = new Command();

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
        process.stdin.pipe(process.stdout);
        console.log('Hello world!');
        console.log(file);
    });

/**
 *
 */
program.parse(process.argv || process.stdin);
