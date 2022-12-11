import { Close, Check } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from '@mui/material'
import { Tweet } from '@prisma/client'
import { useState } from 'react'
import { useAlert } from 'hooks/alertHook'
import { useConfirm } from 'hooks/confirmHook'

type TweetFormItem = {
  content: string
}

type TweetFormHook = [(title: string, text: string, tweet?: Tweet) => Promise<TweetFormItem | undefined>, () => JSX.Element]

export const useTweetForm = (): TweetFormHook => {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [tweet, setTweet] = useState<Tweet | undefined>()
  const [resolveCallback, setResolveCallback] = useState<{
    do: (value: TweetFormItem | PromiseLike<TweetFormItem> | undefined) => void
  }>({ do: () => {} })
  const [tweetContent, setTweetContent] = useState('')

  const [openAlertDialog, renderAlertDialog] = useAlert()
  const [openConfirmDialog, renderConfirmDialog] = useConfirm()

  const openForm = async (title: string, text: string, tweet?: Tweet): Promise<TweetFormItem | undefined> => {
    setTitle(title)
    setText(text)
    setTweet(tweet)
    setTweetContent(tweet?.content ?? '')
    setIsOpen(true)
    // ボタンを押すまで待機
    return new Promise((resolve) => {
      setResolveCallback({ do: resolve })
    })
  }

  const close = () => {
    setIsOpen(false)
    resolveCallback.do(undefined)
  }

  const validateItem = async () => {
    setIsLoading(true)
    const isConfirmed = await openConfirmDialog('Confirm', 'OK?')
    if (!isConfirmed) {
      setIsLoading(false)
      return
    }
    if (tweetContent === '') {
      await openAlertDialog('error', 'Empty exists.')
      setIsLoading(false)
      return
    }
    if (tweetContent === tweet?.content) {
      await openAlertDialog('error', 'No edit.')
      setIsLoading(false)
      return
    }
    setIsLoading(false)
    setIsOpen(false)
    resolveCallback.do({ content: tweetContent })
  }

  const renderForm = () => (
    <>
      <Dialog open={isOpen} onClose={close}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{text}</DialogContentText>
          <TextField
            margin="dense"
            label="Content"
            type="text"
            fullWidth
            variant="outlined"
            required
            multiline
            rows={4}
            onChange={(e) => {
              setTweetContent(e.currentTarget.value)
            }}
            defaultValue={tweetContent}
          />
        </DialogContent>
        <DialogActions>
          <LoadingButton onClick={validateItem} variant="contained" loading={isLoading} startIcon={<Check />}>
            OK
          </LoadingButton>
          <Button onClick={close} variant="outlined" startIcon={<Close />}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {renderAlertDialog()}
      {renderConfirmDialog()}
    </>
  )

  return [openForm, renderForm]
}
