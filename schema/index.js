// Import type helpers from grapgql-js
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql')

// const pgdb = require('../database/pgdb')
// const mdb = require('../database/mdb')


// The root query type where we define the graph
const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => {
    const UserType = require('./types/user')
    return {
      // hello: {
      //   type: GraphQLString,
      //   description: 'The *mandatory* hello world example. GraphQL Style.',
      //   resolve: () => 'world'
      // }
      me: {
        type: UserType,
        description: 'The current user identified by an api key',
        args: {
          key: { type: new GraphQLNonNull(GraphQLString) }
        },
        // resolve: (obj, args, { pgPool }) => {
        resolve: (obj, args, { loaders }) => {
          // 1st arg - object
          // 2nd arg - arguments (e.g. args.key)
          // 3rd arg - context (declared in app.use of graphqlHTTP)
          
          // return {
          //   id: 42,
          //   email: 'fake@example.com'
          // }

          // return pgdb(pgPool).getUserByApiKey(args.key)
          // console.log(args.key)
          return loaders.usersByApiKeys.load(args.key)
        }
      }
    }
  }
})

const AddContestMutation = require('./mutations/add-contest')
const AddNameMutation = require('./mutations/add-name')

const RootMutationType = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: () => ({
    AddContest: AddContestMutation,
    AddName: AddNameMutation
  })
})

const ncSchema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
})

module.exports = ncSchema
