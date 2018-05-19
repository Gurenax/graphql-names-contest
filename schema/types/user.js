const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt
} = require('graphql')

// const pgdb = require('../../database/pgdb')
const mdb = require('../../database/mdb')

module.exports = new GraphQLObjectType({
  name: 'UserType',
  fields: () => {
    const ContestType = require('./contest')
    
    return {
      id: { type: GraphQLID },
      firstName: { type: GraphQLString },
      lastName: { type: GraphQLString },
      fullName: {
        type: GraphQLString,
        resolve: obj => `${obj.firstName} ${obj.lastName}`
      },
      email: { type: new GraphQLNonNull(GraphQLString) },
      createdAt: { type: GraphQLString },
      contests: {
        type: new GraphQLList(ContestType),
        resolve(obj, args, { loaders }) {
        // resolve(obj, args, { pgPool }) {
          // Read contests from db
          //return pgdb(pgPool).getContests(obj)
          // console.log(obj)
          return loaders.contestsForUserIds.load(obj.id)
        }
      },
      // contestsCount: {
      //   type: GraphQLInt,
      //   resolve(obj, args, { mPool }, { fieldName }) {
      //     return mdb(mPool).getCounts(obj, fieldName)
      //   }
      // },
      // namesCount: {
      //   type: GraphQLInt,
      //   resolve(obj, args, { mPool }, { fieldName }) {
      //     return mdb(mPool).getCounts(obj, fieldName)
      //   }
      // },
      // votesCount: {
      //   type: GraphQLInt,
      //   resolve(obj, args, { mPool }, { fieldName }) {
      //     return mdb(mPool).getCounts(obj, fieldName)
      //   }
      // }
      contestsCount: {
        type: GraphQLInt,
        resolve(obj, args, { loaders }, { fieldName }) {
          return loaders.mdb.usersByIds.load(obj.id)
            .then(res => res[fieldName])
        }
      },
      namesCount: {
        type: GraphQLInt,
        resolve(obj, args, { loaders }, { fieldName }) {
          return loaders.mdb.usersByIds.load(obj.id)
            .then(res => res[fieldName])
        }
      },
      votesCount: {
        type: GraphQLInt,
        resolve(obj, args, { loaders }, { fieldName }) {
          return loaders.mdb.usersByIds.load(obj.id)
            .then(res => res[fieldName])
        }
      }
    }
  }
})