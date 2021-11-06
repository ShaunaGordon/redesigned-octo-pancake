# Overview

## General Notes

Because this is a code sample, the files are more heavily commented than I typically do, though they are in a similar vein to the comments I maintain. Outside of documentation comments, I will typically provide notes on why something is done the way it is, especially if it's suboptimal or non-obvious and the code can't speak for itself. My aim is generally to provide code that is clean and clear enough that it can be read on its own for the most part. (Use comments for *why*, let the code describe the *what*.)

Comments that are specifically because it's a code sample have the `Notes:` prefix on them. I've found these sorts of notes useful for providing context-specific information and explanations of decisions and assumptions made, helping streamline this part of the interview/review process.

## Running Application

**Requirements:**

- Node 16+
- Yarn or NPM

**Running:**

- `npm install` or `yarn install`
- Running program: `node index.js file.csv` or `cat file.csv | node index.js`
- Running tests: `jest`
- Running full suite, with integration tests (hits API): `jest --all`
