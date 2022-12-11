import Head from 'next/head'
import { CircularProgress } from '@mui/material'
import { Suspense } from 'react'
import { GetServerSideProps } from 'next'
import { PATH, TITLE } from 'utils/const'
import { ErrorBoundary } from 'react-error-boundary'
import dynamic from 'next/dynamic'
import { Session, unstable_getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import TweetForm from 'components/TweetFrom'
import { getRedirectParam } from 'utils/routerUtils'
const TweetList = dynamic(
  async () => {
    return (await import('components/TweetList')).TweetList
  },
  {
    ssr: false
  }
)

type Props = {
  session: Session | null
}

const Home: React.FC<Props> = ({ session }) => {
  return (
    <>
      <Head>
        <title>{`Home / ${TITLE}`}</title>
      </Head>
      <h1>Home</h1>
      <TweetForm userName={session?.user.name || undefined} image={session?.user.image || undefined} />
      <ErrorBoundary fallback={<></>}>
        <Suspense fallback={<CircularProgress color="inherit" />}>
          <TweetList></TweetList>
        </Suspense>
      </ErrorBoundary>
    </>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)
  if (!session) {
    return getRedirectParam(PATH.TOP)
  }
  const props: Props = { session: session }
  return { props: props }
}
