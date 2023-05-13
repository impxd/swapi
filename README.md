# Star Wars API

## Production URL

http://swapi.iamm.mp/

## Repository

https://github.com/impxd/swapi

## Main Technologies

- Angular v16 - Web development framework.
- TypeScript v5 - A strongly typed programming language that builds on JavaScript.
- RxJS - Reactive Extensions Library for JavaScript.
- Zod - TypeScript-first schema validation with static type inference.
- Vitest - Blazing Fast Unit Test Framework.

## Development enviroment

- Node.js (tested v16)
- npm
- Prettier (auto format on save) Optional

## General building process

- Explore the SWAPI API
- Add the SWAPI service that makes API calls
- Build Films screen
- Build Starships screen
- Build Starship Edit screen
  - Add info field tooltips
  - Add loaders
  - Add runtime schema validations
  - Add reset form feature
  - Add detection for changed inputs
  - Add confirm dialog
  - Add local storage database implementation
  - Add save & delete actions
- Add error handling for network errors
- Add some unit tests
- TODO: e2e testing

## Folder structure (src)

- `styles.scss`: Global styles including the theme colors and some component utils.
- `app/pages`: Page Components for Films and Starship models
- `app/shared/services`: SWAPI service that abstracts the API calls and the local storage database
- `app/shared/schemas.ts`: Zod schemas for the Starship type
- `app/shared/utils.ts`: Some utility functions
- `app/config.ts`: Config for the bootstrapApplication function
- `app/app.component.ts`: Entry view app shell

## Setup

``` bash
# install node dependencies
$ npm i
```

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm run test` to execute the unit tests.
