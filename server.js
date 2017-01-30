var express = require('express')
var graphqlHTTP = require('express-graphql')
var { buildSchema } = require('graphql')
var casual = require('casual')

var schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
    rollDice(numDice: Int!, numSides: Int): [Int]
  }`)

  var root = {
    quoteOfTheDay: () => {
      return casual.sentence
    },
    random: () => {
      return casual.random
    },
    rollThreeDice: () => {
      return [1,2,3].map(_ => casual.integer(from = 0, to = 6))
    },
    rollDice: ({ numDice, numSides}) => {
      return casual.array_of_digits(n=numDice).map(_ => casual.integer(from = 0, to = (numSides || 6)))
    }
  }

  var app = express()
  app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  }))
// start server
app.listen(4000, () => {
  console.log('Listening at port', 4000);
});
