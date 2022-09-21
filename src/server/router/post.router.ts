import { createRouter } from '../createContext'

export const postRouter = createRouter()
  .mutation('create-post', {})
  .query('posts', {})
  .query('single-post', {})
