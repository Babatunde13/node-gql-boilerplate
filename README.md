# NodeJS GQL Boilerplate

This codebase is a boiler plate for GraphQL using TypeScript and MongoDB. It is built using [Apollo Server](https://www.apollographql.com/docs/apollo-server/) and [TypeScript](https://www.typescriptlang.org/). It also uses [Codegen](https://graphql-code-generator.com/) to generate types for GraphQL queries and mutations. It uses [MongoDB](https://www.mongodb.com/) as the database and and [Mocha](https://mochajs.org/) as the testing framework.

## Getting Started

To get started, you will need to create a `.env` file in the root directory of this project. This file will contain the environment variables as declared in [`envs.ts`](./src/config//envs.ts), this file serves as the single source of truth for environment variables. As a result the use of `process.env` outside of this file is discouraged.

To run this project locally, you will need to have a local instance of [MongoDB](https://www.mongodb.com/) and [redis](https://redis.io/) running. You can do this by either installing MongoDB locally or by running a docker container. To run a docker container, run the following command:

```bash
docker run -d -p 27017:27017 --name node-gql-boilerplate mongo
```

Once you have a local instance of MongoDB running, you can run the following commands to start the project:

```bash
yarn install
```

To generate graphql types after making changes to the schema, run the following command:

```bash
yarn generate
```

To run the project in development mode, run the following command:

```bash
yarn dev
```

## To run the compiled project instead

```bash
yarn build && yarn start
```

## To run the project with docker

```bash
yarn docker:build && yarn docker:run
```

## To run tests

```bash
yarn test
```

## To run tests with docker

```bash
yarn docker:test
```

Built with ❤️ by [Babatunde Koiki](https://twitter.com/bkoiki950)
