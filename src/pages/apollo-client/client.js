// ./apollo-client.js

import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
    uri: "http://192.168.0.112:7000/graphql",
    cache: new InMemoryCache()
});

export default client;