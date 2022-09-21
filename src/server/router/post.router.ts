import { createPostSchema, getSinglePostSchema } from '../../schema/post.schema'
import * as trpc from '@trpc/server'
import { createRouter } from '../createContext'

export const postRouter = createRouter()
  .mutation('create-post', {
    input: createPostSchema,
    async resolve({ ctx, input }) {
      if (!ctx.user) {
        new trpc.TRPCError({
          code: 'FORBIDDEN',
          message: 'Can not create a post while logged out',
        })
      }

      const post = await ctx.prisma.post.create({
        data: {
          ...input,
          user: {
            connect: {
              id: ctx.user?.id,
            },
          },
        },
      })
      return post
    },
  })
  .mutation('delete-post', {
    input: getSinglePostSchema,
    async resolve({ ctx, input }) {
      if (!ctx.user) {
        new trpc.TRPCError({
          code: 'FORBIDDEN',
          message: 'Can not delete a post while logged out',
        })
      }

      return ctx.prisma.post.delete({
        where: {
          id: input.postId,
        },
      })
    },
  })
  .query('posts', {
    async resolve({ ctx }) {
      return ctx.prisma.post.findMany()
    },
  })
  .query('single-post', {
    input: getSinglePostSchema,
    async resolve({ ctx, input }) {
      return ctx.prisma.post.findUnique({
        where: {
          id: input.postId,
        },
      })
    },
  })
