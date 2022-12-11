import { AppBar, Button, IconButton, MenuItem, Toolbar, Typography, Menu, Box, Avatar } from '@mui/material'
import { Menu as MenuIcon, Logout, Person, FormatListBulleted } from '@mui/icons-material'
import { useState } from 'react'
import { DrawerMenu } from 'components/DrawerMenu'
import { PATH, TITLE } from 'utils/const'
import { useRouter } from 'next/router'
import { signIn, signOut, useSession } from 'next-auth/react'

export const Header = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const toggleDrawer = () => setDrawerOpen(!drawerOpen)

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenu = async () => {
    setAnchorEl(null)
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" component="div" sx={{ cursor: 'pointer' }} onClick={() => router.push(PATH.TOP)}>
            {TITLE}
          </Typography>
          <Box sx={{ flexGrow: 1 }}></Box>
          {session ? (
            <>
              <IconButton
                size="medium"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={openMenu}
                color="inherit"
              >
                <Avatar alt={session.user.name || ''} src={session.user.image || ''} />
              </IconButton>
              <Menu
                id="menu-appbar"
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
                <MenuItem
                  onClick={() => {
                    closeMenu()
                    router.push(PATH.HOME)
                  }}
                >
                  <FormatListBulleted sx={{ mr: 1 }} />
                  <Box>Home</Box>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    closeMenu()
                    router.push(`${PATH.USER}/${session.user.id}`)
                  }}
                >
                  <Person sx={{ mr: 1 }} />
                  <Box>Profile</Box>
                </MenuItem>
                <MenuItem
                  onClick={async () => {
                    closeMenu()
                    await signOut()
                    router.push(PATH.TOP)
                  }}
                >
                  <Logout sx={{ mr: 1 }} />
                  <Box>Logout</Box>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                onClick={async () => {
                  await signIn('twitter')
                }}
              >
                Sign In
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <DrawerMenu open={drawerOpen} onClose={toggleDrawer}></DrawerMenu>
    </>
  )
}
