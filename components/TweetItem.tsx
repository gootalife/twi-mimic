import { Avatar, Box, IconButton, Menu, MenuItem } from '@mui/material'
import { Delete, FavoriteBorder, Loop, Reply, IosShare, MoreHoriz, Report, PersonAddAlt1 } from '@mui/icons-material'
import { useSWRConfig } from 'swr'
import { useConfirm } from 'hooks/confirmHook'
import { useAlert } from 'hooks/alertHook'
import { deleteTweet, TweetFetchItem } from 'utils/dao'
import { API_BASE_PATH, PATH } from 'utils/const'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/router'

type Props = {
  tweet: TweetFetchItem
}

export const TweetItem: React.FC<Props> = ({ tweet }) => {
  const { data: session } = useSession()
  const [openAlertDialog, renderAlertDialog] = useAlert()
  const [openConfirmDialog, renderConfirmDialog] = useConfirm()
  const { mutate } = useSWRConfig()
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  const clickDelete = async () => {
    try {
      const isConfirmed = await openConfirmDialog('Confirm', 'Delete This?')
      if (!isConfirmed) {
        return
      }
      const res = await deleteTweet(tweet.id)
      if (res.ok) {
        await openAlertDialog('Completed', 'Delete completed.')
        mutate(API_BASE_PATH.TWEET)
      } else {
        throw new Error()
      }
    } catch (err) {
      await openAlertDialog('Error', 'Failed')
    }
  }

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Avatar
          alt={tweet.user.name || undefined}
          src={tweet.user.image || undefined}
          sx={{ cursor: 'pointer' }}
          onClick={() => router.push(PATH.TOP)}
        />

        <Box sx={{ flexGrow: 1, pl: 1 }}>
          <Box sx={{ pb: 1, display: 'flex' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>{tweet.user.name}</Box>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton aria-label="delete" onClick={openMenu} size={'small'}>
                  <MoreHoriz />
                </IconButton>
                <Menu
                  id="menu-bar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  open={anchorEl != null}
                  onClose={closeMenu}
                >
                  {session?.user.id === tweet.userId ? (
                    <MenuItem
                      onClick={async () => {
                        await clickDelete()
                        closeMenu()
                      }}
                    >
                      <Delete sx={{ pr: 1 }} />
                      <Box>Delete this tweet</Box>
                    </MenuItem>
                  ) : (
                    <>
                      <MenuItem
                        onClick={async () => {
                          closeMenu()
                        }}
                      >
                        <PersonAddAlt1 sx={{ pr: 1 }} />
                        <Box>Follow {tweet.user.name}</Box>
                      </MenuItem>
                      <MenuItem
                        onClick={async () => {
                          closeMenu()
                        }}
                      >
                        <Report sx={{ pr: 1 }} />
                        <Box>Report</Box>
                      </MenuItem>
                    </>
                  )}
                </Menu>
              </Box>
            </Box>
          </Box>

          <Box>{tweet.content}</Box>
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
            <IconButton aria-label="reply" size={'small'}>
              <Reply />
            </IconButton>
            <IconButton aria-label="retweet" size={'small'}>
              <Loop />
            </IconButton>
            <IconButton aria-label="like" size={'small'}>
              <FavoriteBorder />
            </IconButton>
            <IconButton aria-label="share" size={'small'}>
              <IosShare />
            </IconButton>
          </Box>
        </Box>
      </Box>
      {renderAlertDialog()}
      {renderConfirmDialog()}
    </>
  )
}
