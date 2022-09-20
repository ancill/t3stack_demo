import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { TRPCError } from '@trpc/server'
import { getBaseUrl } from '../../pages/_app'

import { createUserSchema, requestOtpSchema } from '../../schema/user.schema'
import { encode } from '../../utils/base64'
import { sendLoginEmail } from '../../utils/mailer'

import { createRouter } from './context'

export const userRouter = createRouter()
  .mutation('register-user', {
    input: createUserSchema,
    async resolve({ ctx, input }) {
      const { email, name } = input
      try {
        const user = await ctx.prisma.user.create({
          data: {
            email,
            name,
          },
        })
        return user
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === 'P2002') {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'User already exist',
            })
          }
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
        })
      }
    },
  })
  .mutation('request-otp', {
    input: requestOtpSchema,
    async resolve({ input, ctx }) {
      const { email, redirect } = input

      const user = await ctx.prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      }

      const token = await ctx.prisma.loginToken.create({
        data: {
          redirect,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      })

      // send email to user

      await sendLoginEmail({
        token: encode(`${token.id}:${user.email}`),
        url: `${getBaseUrl()}`,
        email: user.email,
      })

      return true
    },
  })
