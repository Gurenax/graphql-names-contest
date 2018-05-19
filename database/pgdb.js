const { orderedFor } = require('../lib/util')
const humps = require('humps')
const { slug } = require('../lib/util')

module.exports = pgPool => {

  return {
    getUsersByIDs(userIds) {
      return pgPool.query(`
        select * from users
        where id = ANY($1)
      `, [userIds]).then(res => {
        // // e.g. camelize sql fields e.g. first_name to firstName
        // return humps.camelizeKeys(res.rows)
        // console.log(orderedFor(res.rows, userIds, 'id'))
        return orderedFor(res.rows, userIds, 'id', true)
      })
    },

    // getUserByID(userId) {
    //   return pgPool.query(`
    //     select * from users
    //     where id = $1
    //   `, [user.id]).then(res => {
    //     // e.g. camelize sql fields e.g. first_name to firstName
    //     return humps.camelizeKeys(res.rows[0])
    //   })
    // },

    getUsersByApiKeys(apiKeys) {
      return pgPool.query(`
        select * from users
        where api_key = ANY($1)
      `, [apiKeys]).then(res => {
        // e.g. camelize sql fields e.g. first_name to firstName
        // return humps.camelizeKeys(res.rows)
        // console.log( orderedFor(res.rows, apiKeys, 'apiKey') )
        return orderedFor(res.rows, apiKeys, 'apiKey', true)
      })
    },

    // getUserByApiKey(apiKey) {
    //   return pgPool.query(`
    //     select * from users
    //     where api_key = $1
    //   `, [apiKey]).then(res => {
    //     // e.g. camelize sql fields e.g. first_name to firstName
    //     return humps.camelizeKeys(res.rows[0])
    //   })
    // },

    getContestsForUserIds(userIds) {
      // console.log('userIds -> ', userIds)
      return pgPool.query(`
        select * from contests
        where created_by = ANY($1)
      `, [userIds]).then(res => {
        // e.g. camelize sql fields e.g. first_name to firstName
        // return humps.camelizeKeys(res.rows)
        // console.log('res.rows -> ', res.rows)
        return orderedFor(res.rows, userIds, 'createdBy', false)
      })
    },

    // getContests(user) {
    //   return pgPool.query(`
    //     select * from contests
    //     where created_by = $1
    //   `, [user.id]).then(res => {
    //     // e.g. camelize sql fields e.g. first_name to firstName
    //     return humps.camelizeKeys(res.rows)
    //   })
    // },

    getNamesForContestIds(contestIds) {
      // console.log('contestIds -> ', contestIds)
      return pgPool.query(`
        select * from names
        where contest_id = ANY($1)
      `, [contestIds]).then(res => {
        // e.g. camelize sql fields e.g. first_name to firstName
        // return humps.camelizeKeys(res.rows)
        // console.log('res.rows -> ', res.rows)
        return orderedFor(res.rows, contestIds, 'contestId', false)
      })
    },

    // getNames(contest) {
    //   return pgPool.query(`
    //     select * from names
    //     where contest_id = $1
    //   `, [contest.id]).then(res => {
    //     // e.g. camelize sql fields e.g. first_name to firstName
    //     return humps.camelizeKeys(res.rows)
    //   })
    // }

    getTotalVotesByNameIds(nameIds) {
      return pgPool.query(`
        select name_id, up, down from total_votes_by_name
        where name_id = ANY($1)
      `, [nameIds]).then(res => {
        // console.log(orderedFor(res.rows, nameIds, 'nameId', true))
        return orderedFor(res.rows, nameIds, 'nameId', true)
      })
    },

    addNewContest({ apiKey, title, description}) {
      return pgPool.query(`
        insert into contests(code, title, description, created_by)
        values ($1, $2, $3, 
          (select id from users where api_key = $4))
        returning *
      `, [slug(title), title, description, apiKey]).then(res => {
        return humps.camelizeKeys(res.rows[0])
      })
    },

    addNewName({ apiKey, contestId, title, description }) {
      return pgPool.query(`
        insert into names(contest_id, label, description, normalized_label, created_by)
        values($2, $3, $4, $5,
          (select id from users where api_key = $1))
        returning *
      `, [apiKey, contestId, title, description, slug(title)]).then(res => {
        return humps.camelizeKeys(res.rows[0])
      })
    }
  }
}