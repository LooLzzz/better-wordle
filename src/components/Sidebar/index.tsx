import { Button, Code, Divider, Drawer, DrawerProps, NavLink, NavLinkProps, Stack, Switch, Text, Title, useMantineColorScheme } from '@mantine/core'
import { Link, LinkProps, useLocation, useMatchRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

import { MoonStarsIcon, SunIcon } from '@/assets'
import { useSwipe, useWordleStore } from '@/hooks'
import { secondsToHms } from '@/utils'

interface SidebarProps extends DrawerProps {

}

const NavRouterLink = ({ label, to, ...props }: LinkProps & NavLinkProps) => {
  const matchRoute = useMatchRoute()

  return (
    <NavLink
      active={!!matchRoute({ to })}
      component={Link}
      to={to}
      label={label}
      rightSection={
        <span style={{ fontFamily: 'monospace' }}>{'>'}</span>
      }
      {...props}
    />
  )
}

const Sidebar = ({ opened, onClose, ...props }: SidebarProps) => {
  const [
    resetStore,
    time,
  ] = useWordleStore((state) => [
    state.resetStore,
    state.time,
  ])
  const location = useLocation()
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

  const handleResetStore = () => {
    resetStore()
    onClose()
  }

  useSwipe({
    left: onClose
  })

  useEffect(() => {
    onClose()
  }, [location])

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={<Title order={2}>Settings</Title>}
      {...props}
    >
      <Stack>
        <Text>
          Session Time: <Code fz='sm'>{secondsToHms(time)}</Code>
        </Text>

        <Switch
          color='dark.4'
          label='Dark mode'
          size='md'
          checked={colorScheme === 'dark'}
          onChange={toggleColorScheme}
          onLabel={<MoonStarsIcon strokeWidth={2.5} width='1rem' color='var(--mantine-color-blue-6)' />}
          offLabel={<SunIcon strokeWidth={2.5} width='1rem' color='var(--mantine-color-yellow-7)' />}
        />

        <Divider />

        <Stack gap={0}>
          <NavRouterLink
            to='/'
            label='Wordle'
          />
          <NavRouterLink
            to='/helper'
            label='Helper'
          />
        </Stack>

        <Divider />

        <Button onClick={handleResetStore}>
          Restart Game
        </Button>
      </Stack>
    </Drawer>
  )
}

export {
  Sidebar as default,
  type SidebarProps
}
