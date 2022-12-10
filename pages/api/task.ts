import { Task } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import prisma from 'utils/prisma'
import { authOptions } from './auth/[...nextauth]'

interface ExtendedNextApiRequest extends NextApiRequest {
  body: Partial<Task>
}

const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { method, body } = req
  if (!session || !session.user.id) {
    res.status(401).json({})
  } else {
    try {
      const userId = await prisma.user.findFirst({
        where: {
          id: session.user.id
        }
      })
      if (!userId) {
        res.status(500)
        return
      }
      switch (method) {
        case 'GET':
          const tasks = await prisma.task.findMany({
            where: {
              userId: session.user.id
            }
          })
          res.status(200).json(tasks)
          break
        case 'POST':
          await prisma.task.create({
            data: {
              userId: session.user.id,
              title: body.title ?? '',
              content: body.content ?? ''
            }
          })
          res.status(200).json({})
          break
        case 'PUT':
          await prisma.task.update({
            where: {
              id: body.id
            },
            data: {
              title: body.title,
              content: body.content
            }
          })
          res.status(200).json({})
          break
        case 'DELETE':
          await prisma.task.delete({
            where: {
              id: body.id
            }
          })
          res.status(200).json({})
          break
      }
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    }
  }
}

export default handler
