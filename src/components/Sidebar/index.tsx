import { Button, Divider, Drawer, DrawerProps, Stack, Switch, Title, useMantineColorScheme } from '@mantine/core'

import { MoonStarsIcon, SunIcon } from '@/assets'
import { useWordleStore } from '@/hooks'

interface SidebarProps extends DrawerProps {

}

const Sidebar = ({ opened, onClose, ...props }: SidebarProps) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const resetStore = useWordleStore((state) => state.resetStore)

  const handleResetStore = () => {
    resetStore()
    onClose()
  }

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={<Title order={2}>Settings</Title>}
      {...props}
    >
      <Stack>
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
