const gql = require('graphql-tag');
const { ApolloServer } = require('apollo-server');

const typeDefs = gql`
    # you can make comments
    """
    how you document a type
    """
    enum ShoeType {
        JORDAN
        NIKE
        ADDIDAS
        TIMBERLAND
    }

    type User {
        email: String!
        avatar: String
        shoes: [Shoe]!
    }
    # cannot query for this, it is an abstract type
    interface Shoe {
        brand: ShoeType!
        size: Int!
        user: User!
    }

    type Sneaker implements Shoe {
        brand: ShoeType!
        size: Int!
        user: User!
        sport: String!
    }

    type Boot implements Shoe {
        brand: ShoeType!
        size: Int!
        user: User!
        hasGrip: Boolean!
    }

    input ShoesInput {
        brand: String
        size: Int
    }

    input NewShoeInput {
        brand: ShoeType!
        size: Int!
    }

    type Query  {
        me: User!
        friends: [User]!
        shoes(input: ShoesInput): [Shoe]
    }

    type Mutation {
        shoe(input: NewShoeInput!): Shoe!
    }
`
const resolvers = {
    Query: {
        me() {
            return {
                id: 1,
                email: 'hi@hi.com',
                avatar: 'http://google.com',
                shoes: []
            }
        },
        shoes(_, {input}) {
            return [{brand: 'NIKE', size: 12, sport: 'basketball', user: 1},
            {brand: 'ADDIDAS', size: 8, sport: 'soccer', user: 1},
            {brand: 'TIMBERLAND', size: 4, hasGrip: true, user: 1}
        ]
            // .filter(shoe => shoe.brand === input.brand)
        }
    },
    Mutation: {
        shoe(_, {input}) {
            return input
        }
    },
    Shoe: {
        __resolveType(shoe) {
            if(shoe.sport) return 'Sneaker'
            return 'Boot'
        }
    },
    Sneaker: {
        user(shoe) {
            // would normally go get user with the given shoe
            return {
                id: 1,
                email: 'hi@hi.com',
                avatar: 'http://google.com',
                shoes: []
            }
        }
    },
    Boot: {
        user(shoe) {
            // would normally go get user with the given shoe
            return {
                id: 1,
                email: 'hi@hi.com',
                avatar: 'http://google.com',
                shoes: []
            }
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen(4000).then(() => console.log(`Listening on port 4000`));
