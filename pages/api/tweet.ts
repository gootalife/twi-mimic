import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import prisma from 'lib/prisma'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { TweetAPIParam } from 'utils/dao'

interface ExtendedNextApiRequest extends NextApiRequest {
  body: TweetAPIParam
}

const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { method, body } = req
  if (!session || !session.user.id) {
    res.status(401).json({})
  } else {
    try {
      if (!session.user.id) {
        res.status(500)
        return
      }
      switch (method) {
        case 'GET':
          const tweets = await prisma.tweet.findMany({
            where: {
              userId: session.user.id
            },
            include: {
              user: {
                select: {
                  name: true,
                  image: true
                }
              }
            },
            take: 30
          })
          res.status(200).json(tweets)
          return
        case 'POST':
          await prisma.tweet.create({
            data: {
              userId: session.user.id,
              content: body.content ?? ''
            }
          })
          res.status(200).json({})
          return
        case 'PUT':
          await prisma.tweet.update({
            where: {
              id: body.id
            },
            data: {
              content: body.content
            }
          })
          res.status(200).json({})
          return
        case 'DELETE':
          await prisma.tweet.delete({
            where: {
              id: body.id
            }
          })
          res.status(200).json({})
          return
      }
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    }
  }
}

export default handler
