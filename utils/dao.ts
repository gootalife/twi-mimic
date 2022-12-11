import { Tweet } from '@prisma/client'
import { API_BASE_PATH } from 'utils/const'

export type TweetAPIParam = Partial<Pick<Tweet, 'id' | 'content'>>

export type TweetFetchItem = (Tweet & {
  user: {
    image: string | null;
    name: string | null;
  };
})

export const fetchTweet = async () => {
  const res = await fetch(API_BASE_PATH.TWEET, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const tweets = (await res.json()) as (Tweet & {
    user: {
      image: string | null;
      name: string | null;
    };
  })[]
  return tweets
}

export const insertTweet = async (param: TweetAPIParam) => {
  const res = await fetch(API_BASE_PATH.TWEET, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(param)
  })
  return res
}

export const updateTweet = async (param: TweetAPIParam) => {
  const res = await fetch(API_BASE_PATH.TWEET, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(param)
  })
  return res
}

export const deleteTweet = async (id: string) => {
  const param: TweetAPIParam = {
    id: id
  }
  const res = await fetch(API_BASE_PATH.TWEET, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(param)
  })
  return res
}
