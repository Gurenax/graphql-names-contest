const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList
} = require('graphql')

// const pgdb = require('../../database/pgdb')

module.exports = new GraphQLObjectType({
  name: 'ContestType',

  fields: () => {
    const ContestStatusType = require('./contest-status')
    const NameType = require('./name')

    return {
      id: { type: GraphQLID },
      code: { type: new GraphQLNonNull(GraphQLString) },
      title: { type: new GraphQLNonNull(GraphQLString)},
      description: { type: GraphQLString },
      status: { type: new GraphQLNonNull(ContestStatusType) },
      createdAt: { type: new GraphQLNonNull(GraphQLString)},
      names: {
        type: new GraphQLList(NameType),
        // resolve(obj, args, { pgPool }) {
        resolve(obj, args, { loaders }) {
          // return pgdb(pgPool).getNames(obj)
          return loaders.namesForContestIds.load(obj.id)
        }
      }
    }
  }
})