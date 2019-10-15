const { gql } = require('apollo-server')

/**
 * Type Definitions for our Schema using the SDL.
 */
const typeDefs = gql`
    type Pet {
        id: ID!
        createdAt: String!
        name: String!
        type: String!
        img: String
        user: User
    }
    type User {
        id: ID!
        username: String!
        pets: [Pet]
    }
    input PetInput {
        name: String
        type: String
    }
    input NewPetInput {
        name: String!
        type: String!
    }
    type Query {
        pets(input: PetInput): [Pet]!
        pet(id: String): Pet
    }
    type Mutation {
        pet(input: NewPetInput): Pet
    }
`;

module.exports = typeDefs
