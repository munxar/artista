import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs, resolvers } from './schema'
import cors from 'cors'
import { renderTemplateStream } from './render'
import { url, port } from './environment'

const server = new ApolloServer({ typeDefs, resolvers })

const app = express()
app.use(cors())
server.applyMiddleware({ app })

app.get('/:id/:width?', async ({ params, query: args }, res) => {
  const [id, format] = params.id.split('.')
  const { width } = params
  const stream = await renderTemplateStream({ id, args }, { format, width })
  if (stream) {
    stream.pipe(res)
  } else {
    res.statusCode = 404
    res.send('not found')
  }
})

app.listen({ port }, () => {
  console.log(`Server ready at ${url(server.graphqlPath)}`)
});
