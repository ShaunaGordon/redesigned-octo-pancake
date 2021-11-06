# Overview

## Running Application

**Requirements:**

- Node 16+
- Yarn or NPM

**Running:**

- Copy `.env-sample` to `.env` and fill in `ADDRESS_KEY` with your AddressValidator API key.
- Install dependencies: `npm install` or `yarn install`
- Running program: `node index.js file.csv` or `cat file.csv | node index.js`
- Running tests: `jest`

## General Notes

Because this is a code sample, the files are more heavily commented than I typically do, though they are in a similar vein to the comments I maintain. Outside of documentation comments, I will typically provide notes on why something is done the way it is, especially if it's suboptimal or non-obvious and the code can't speak for itself. My aim is generally to provide code that is clean and clear enough that it can be read on its own for the most part. (My rule of thumb - Use comments for *why*, let the code describe the *what*.)

Comments that are specifically because it's a code sample have the `Notes:` prefix on them. I've found these sorts of notes useful for providing context-specific information and explanations of decisions and assumptions made, helping streamline this part of the interview/review process.

### Why JS/NodeJS?

In short, it's easy to get up and running without additional tools and rarely runs into runtime version hell, since the runtime ecosystem heavily encourages keeping it up to date. In this day and age, Node is a staple of developers and related systems, so the likelihood of it being available is high. Both of these are higher priority as a command line application (vs a web app, where I'd be more inclined to use Docker to set up a self-contained environment).

JS and Node are also well-suited to command line application building and interacting with APIs, as well as the quasi-functional (in the Functional Programming sense) nature of a simple "pull data, format, output" process.

Additionally, Jest is a robust and easy to pick up test suite that, frankly, is pleasing to work with. It provides all the necessary tools needed to get a project like this under suitable test, with the ability to easily add tools as needed.

Why CommonJS format instead of ES6 module format? I prefer ES6 format (`import x from y`, etc), personally, but native handling of that is still experimental in Jest, sadly and doesn't really play nice. So, that's relegated to web applications, where my JS would be crosspiled via Webpack, negating the need to keep track of what does and doesn't support ES6 module format.
