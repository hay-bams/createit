import 'reflect-metadata'
import express from 'express'
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import microConfig from './mikro-orm.config'
import { ApolloServer } from 'apollo-server-express'
import {buildSchema} from 'type-graphql'
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/posts';
import { UserResolver } from './resolvers/user';

const main = async () => {
  const orm = await MikroORM.init(microConfig)
  await orm.getMigrator().up()

  const app = express()

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false
    }),
    context: () => ({ em: orm.em })
  })

  apolloServer.applyMiddleware({ app })

  app.listen(4000, () => {
    console.log('Server is listening on port 4000')
  })
  
}

main().catch((err) => {
  console.error(err)
})
