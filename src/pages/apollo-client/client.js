// ./apollo-client.js

import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
    uri: "http://localhost:7000/graphql",
    cache: new InMemoryCache(),
});

export default client;