import { Button, Code, Divider, Drawer, DrawerProps, Stack, Switch, Text, Title, useMantineColorScheme } from '@mantine/core'

import { MoonStarsIcon, SunIcon } from '@/assets'
import { useWordleStore } from '@/hooks'
import { humanReadableSeconds } from '@/utils'

interface SidebarProps extends DrawerProps {

}

const Sidebar = ({ opened, onClose, ...props }: SidebarProps) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const [
    resetStore,
    time,
  ] = useWordleStore((state) => [
    state.resetStore,
    state.time,
  ])

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
        <Text>
          Session Time: <Code fz='sm'>{humanReadableSeconds(time, 1)}</Code>
        </Text>

        <Divider />

        <Switch
          color='dark.4'
          label='Dark mode'
          size='md'
          checked={colorScheme === 'dark'}
          onChange={toggleColorScheme}
          onLabel={<MoonStarsIcon strokeWidth={2.5} width='1rem' color='var(--mantine-color-blue-6)' />}
          offLabel={<SunIcon strokeWidth={2.5} width='1rem' color='var(--mantine-color-yellow-7)' />}
        />

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
