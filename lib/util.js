const humps = require('humps')
const _ = require('lodash')

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',

  orderedFor: (rows, collection, field, singleObject) => {
    // rows - records in the database
    // collection - original input array
    // field - field which will identify row and collection

    // camelize row keys
    const data = humps.camelizeKeys(rows)

    // return the rows ordered for the collection
    const inGroupsOfField = _.groupBy(data, field)
    return collection.map(element => {
      const elementArray = inGroupsOfField[element]
      // if element is present in data
      if (elementArray) {
        return singleObject ? elementArray[0] : elementArray
      }
      return singleObject ? {} : []
    })
  },

  slug: str => {
    return str.toLowerCase().replace(/[\s\W-]+/,'-')
  }
}