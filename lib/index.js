const { nodeEnv } = require('./util')
console.log(`Running in ${nodeEnv} mode...`)

const DataLoader = require('dataloader')
// Import posgresql
const pg = require('pg')
const pgConfig = require('../config/pg')[nodeEnv]
const pgPool = new pg.Pool(pgConfig)
const pgdb = require('../database/pgdb')(pgPool)

// Use express to serve http
const app = require('express')()

// Read query from command line args
// const query = process.argv[2]

// Import schema
const ncSchema = require('../schema')
// const { graphql } = require('graphql')
const graphqlHTTP = require('express-graphql')

// graphql(ncSchema, query).then(result => {
//   console.log(result)
// })

const { MongoClient } = require('mongodb')
const assert = require('assert')
const mConfig = require('../config/mongo')[nodeEnv]

MongoClient.connect(mConfig.url, (err, mPool) => {
  assert.equal(err, null)

  // app.use('/graphql', graphqlHTTP({
  //   schema: ncSchema,
  //   graphiql: true,
  //   context: { pgPool, mPool }
  // }))
  
  const mdb = require('../database/mdb')(mPool)

  app.use('/graphql', (req, res) => {
    const loaders = {
      usersByIds: new DataLoader(pgdb.getUsersByIDs),
      usersByApiKeys: new DataLoader(pgdb.getUsersByApiKeys),
      contestsForUserIds: new DataLoader(pgdb.getContestsForUserIds),
      namesForContestIds: new DataLoader(pgdb.getNamesForContestIds),
      totalVotesByNameIds: new DataLoader(pgdb.getTotalVotesByNameIds),
      activitiesForUserIds: new DataLoader(pgdb.getActivitiesForUserIds),
      mdb: {
        usersByIds: new DataLoader(mdb.getUsersByIds)
      }
    }
    
    graphqlHTTP({
      schema: ncSchema,
      graphiql: true,
      context: { pgPool, mPool, loaders }
    })(req, res)
  })
  
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
  })

})