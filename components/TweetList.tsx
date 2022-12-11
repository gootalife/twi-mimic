import useSWR from 'swr'
import { TweetItem } from 'components/TweetItem'
import { Box } from '@mui/material'
import { API_BASE_PATH } from 'utils/const'
import { fetchTweet, TweetFetchItem } from 'utils/dao'

const isArray = <T,>(maybeArray: T | readonly T[]): maybeArray is T[] => {
  return Array.isArray(maybeArray)
}

export const TweetList = () => {
  const { data: tweets } = useSWR(API_BASE_PATH.TWEET, fetchTweet, { suspense: true })

  return (
    <>
      <hr />
      {tweets && isArray<TweetFetchItem[]>(tweets) && (
        <>
          {tweets?.map((tweet) => (
            <Box key={`hr_${tweet.id}`}>
              <TweetItem key={tweet.id} tweet={tweet}></TweetItem>
              <hr />
            </Box>
          ))}
        </>
      )}
    </>
  )
}
