import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { path } from 'utils/path'
import { authOptions } from './api/auth/[...nextauth]'
import { Session, unstable_getServerSession } from 'next-auth'
import { Box } from '@mui/material'

type Props = {
  session: Session | null
}

const User: React.FC<Props> = ({ session }) => {
  return (
    <>
      <Head>
        <title>ToDoApp</title>
      </Head>
      <h1>User</h1>
      <Box>userId:{session?.user.id}</Box>
    </>
  )
}

export default User

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)
  if (!session) {
    return {
      redirect: {
        destination: path.home,
        permanent: false
      }
    }
  }
  const props: Props = { session: session }
  return { props: props }
}
