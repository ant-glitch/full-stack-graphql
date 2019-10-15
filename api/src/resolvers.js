/**
 * Here are your Resolvers for your Schema. They must match
 * the type definitions in your scheama
 */

module.exports = {
  Query: {
    pets(_, {input}, {models}) {
      return models.Pet.findMany(input)
    },
    pet(_, {id}, {models}) {
      return models.Pet.findOne({id})
    }
  },
  Mutation: {
    pet(_, {input}, {models}) {
      return models.Pet.create(input)
    }
  },
  Pet: {
    img(pet) {
      return pet.type === 'DOG'
        ? 'https://placedog.net/300/300'
        : 'http://placekitten.com/300/300'
    },
    user(pet, __, {user}) {
      return user;
    }
  },
  User: {
    // username(_, __, {models}) {
    //   return models.User.findOne()
    // },
    pets(user, __, {models}) {
      return models.Pet.findMany({})
    }
  }
}
