import Head from 'next/head'
import { Button } from '@mui/material'
import { useRouter } from 'next/router'
import { PATH, TITLE } from 'utils/const'
import { Edit, Login } from '@mui/icons-material'
import { Session, unstable_getServerSession } from 'next-auth'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { signIn } from 'next-auth/react'

type Props = {
  session: Session | null
}

const Index: React.FC<Props> = ({ session }) => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <h1>Wellcome</h1>
      {session ? (
        <Button
          variant="contained"
          onClick={() => {
            router.push(PATH.HOME)
          }}
          startIcon={<Edit />}
        >
          Go To Home
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={async () => {
            await signIn('twitter')
          }}
          startIcon={<Login />}
        >
          Sign in
        </Button>
      )}
    </>
  )
}

export default Index

export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext) => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)
  const props: Props = { session: session }
  return { props: props }
}
