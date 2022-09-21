// src/server/router/index.ts
import { createRouter } from './createContext'
import superjson from 'superjson'
import { userRouter } from './router/user.router'
import { postRouter } from './router/post.router'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('user.', userRouter)
  .merge('posts.', postRouter)

// export type definition of API
export type AppRouter = typeof appRouter
