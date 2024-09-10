import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Code,
  Divider,
  Drawer,
  DrawerRootProps,
  Group,
  Image,
  NavLink,
  NavLinkProps,
  Paper,
  Space,
  Stack,
  Text,
  Title,
  useMantineColorScheme
} from '@mantine/core'
import { useMouse } from '@mantine/hooks'
import { IconMoonStars, IconSun } from '@tabler/icons-react'
import { Link, LinkProps, useLocation, useMatchRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

import { useDraggable, useWordleStore, type PositionDelta } from '@/hooks'
import { secondsToHms } from '@/utils'

interface SidebarProps extends DrawerRootProps { }


const NavRouterLink = ({ label, to, ...props }: LinkProps & NavLinkProps) => {
  const matchRoute = useMatchRoute()

  return (
    <NavLink
      active={!!matchRoute({ to })}
      component={Link}
      to={to}
      label={label}
      rightSection={<Text ff='monospace'>{'>'}</Text>}
      {...props}
      style={{
        borderRadius: 'var(--mantine-radius-sm)',
        ...props.style,
      }}
    />
  )
}

const Sidebar = ({ opened, onClose, ...props }: SidebarProps) => {
  const [
    time,
    resetStore,
  ] = useWordleStore((state) => [
    state.time,
    state.resetStore,
  ])
  const draggableRef = useRef<HTMLDivElement>(null)
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const [hovered, setHovered] = useState(false)
  const mouse = useMouse()
  const location = useLocation()
  const [drawerOffsetX, setDrawerOffsetX] = useState(0)

  const handleResetStore = () => {
    resetStore()
    onClose()
  }

  const handleDragStop = ({ dx }: PositionDelta) => {
    if (dx < -100) {
      onClose()
      setTimeout(() => {
        setDrawerOffsetX(0)
      }, 200)
    } else {
      setDrawerOffsetX(0)
    }
  }
  const handleDrag = ({ dx }: PositionDelta) => {
    setDrawerOffsetX(dx)
  }
  const { dragging } = useDraggable(draggableRef, {
    onDrag: handleDrag,
    onStop: handleDragStop
  })

  useEffect(() => {
    onClose()
  }, [location])

  return (
    <>
      {
        hovered && (
          <Paper
            pos='absolute'
            top={mouse.y - (80 * 1.2)}
            left={mouse.x - (80 * 0.5)}
            radius='lg'
            shadow='sm'
            style={{
              zIndex: 999,
              overflow: 'hidden',
            }}
          >
            <Image
              src='https://avatars.githubusercontent.com/u/8081213'
              w={80}
            />
          </Paper>
        )
      }

      <Drawer.Root
        opened={opened}
        onClose={onClose}
        {...props}
      >
        <Drawer.Overlay />
        <Box ref={draggableRef}>
          <Drawer.Content
            style={{
              transform: `translateX(${Math.min(drawerOffsetX, 0)}px)`,
              transitionProperty: !opened || dragging ? undefined : 'transform',
              transitionDuration: !opened || dragging ? undefined : '0.2s',
              transitionTimingFunction: !opened || dragging ? undefined : 'ease',
            }}
          >
            <Stack h='100%' gap={0}>
              <Drawer.Header>
                <Drawer.Title flex={1}>
                  <Title order={3}>Settings</Title>
                </Drawer.Title>
                <Group gap='0.3rem'>
                  <ActionIcon
                    variant='default'
                    onClick={toggleColorScheme}
                  >
                    {
                      colorScheme === 'dark'
                        ? <IconMoonStars strokeWidth={2.5} width='1rem' color='var(--mantine-color-blue-6)' />
                        : <IconSun strokeWidth={2.5} width='1rem' color='var(--mantine-color-yellow-7)' />
                    }
                  </ActionIcon>
                  <Drawer.CloseButton />
                </Group>
              </Drawer.Header>

              <Drawer.Body flex={1}>
                <Stack h='100%'>
                  <Text>
                    Session Time: <Code>{secondsToHms(time)}</Code>
                  </Text>

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
                    <NavRouterLink
                      to='/settings'
                      label='Settings'
                    />
                  </Stack>

                  <Space flex={1} />

                  <Button onClick={handleResetStore}>
                    Restart Game
                  </Button>

                  <Divider />

                  <Box c='dimmed' fz='xs' style={{ textAlign: 'center' }}>
                    <Text>
                      {'Made with ❤️ by '}
                      <Anchor
                        href='https://github.com/LooLzzz'
                        target='_blank'
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                      >
                        LooLzzz
                      </Anchor>
                    </Text>
                    <Text>
                      {'Give it a ⭐ on '}
                      <Anchor
                        href='https://github.com/LooLzzz/better-wordle/stargazers'
                        target='_blank'
                      >
                        GitHub
                      </Anchor>
                    </Text>
                  </Box>
                </Stack>
              </Drawer.Body>
            </Stack>
          </Drawer.Content>
        </Box>
      </Drawer.Root>
    </>
  )
}

export {
  Sidebar as default,
  type SidebarProps
}
