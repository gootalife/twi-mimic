import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { PATH, TITLE } from 'utils/const'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { unstable_getServerSession, User } from 'next-auth'
import { Avatar, Box } from '@mui/material'
import DefaultErrorPage from 'next/error'
import { getRedirectParam } from 'utils/routerUtils'

type Props = {
  user: User | null
}

const UserPage: React.FC<Props> = ({ user }) => {
  if (!user) {
    return <DefaultErrorPage statusCode={404} />
  }

  return (
    <>
      <Head>
        <title>{`User / ${TITLE}`}</title>
      </Head>
      <h1>User</h1>
      <Avatar alt={user?.name || undefined} src={user?.image || undefined} />
      <Box>User ID: {user?.id}</Box>
      <Box>Email: {user?.email}</Box>
    </>
  )
}

export default UserPage

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)
  const id = context.query.userId

  if (!session || !session.user.id || !id) {
    return getRedirectParam(PATH.TOP)
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: session.user.id
      }
    })
    const props: Props = { user: user }
    return { props: props }
  } catch {
    return getRedirectParam(PATH.HOME)
  }
}
