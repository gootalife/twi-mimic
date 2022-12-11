import { Avatar, Box, TextField } from '@mui/material'
import { useState } from 'react'
import { insertTweet, TweetAPIParam } from 'utils/dao'
import { useAlert } from 'hooks/alertHook'
import { LibraryAdd } from '@mui/icons-material'
import { mutate } from 'swr'
import { API_BASE_PATH, PATH } from 'utils/const'
import { LoadingButton } from '@mui/lab'
import { useRouter } from 'next/router'

type Props = {
  userName?: string
  image?: string
}

const TweetForm: React.FC<Props> = ({ userName, image }) => {
  const [content, setContent] = useState('')
  const [openAlertDialog, renderAlertDialog] = useAlert()
  const [isTweeting, setIsTweeting] = useState(false)
  const router = useRouter()

  const clickInsert = async () => {
    setIsTweeting(true)
    if (content === '') {
      await openAlertDialog('Error', 'Input is invalid.')
      setIsTweeting(false)
      return
    }
    const param: TweetAPIParam = {
      content: content
    }
    try {
      const res = await insertTweet(param)
      if (res.ok) {
        setContent('')
        mutate(API_BASE_PATH.TWEET)
      } else {
        throw new Error()
      }
    } catch {
      await openAlertDialog('Error', 'Failed.')
    }
    setIsTweeting(false)
  }

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Avatar alt={userName} src={image} sx={{ cursor: 'pointer' }} onClick={() => router.push(PATH.TOP)} />
        <Box sx={{ flexGrow: 1, pl: 1 }}>
          <TextField
            id="outlined-basic"
            variant="outlined"
            fullWidth
            multiline
            inputProps={{
              maxLength: 280
            }}
            rows={4}
            placeholder={'What are you doing now?'}
            sx={{ flexGrow: 1 }}
            onChange={(e) => {
              setContent(e.currentTarget.value)
            }}
            value={content}
            disabled={isTweeting}
          />
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton variant="contained" loading={isTweeting} onClick={clickInsert} startIcon={<LibraryAdd />}>
              Tweet
            </LoadingButton>
          </Box>
        </Box>
      </Box>
      {renderAlertDialog()}
    </>
  )
}

export default TweetForm
