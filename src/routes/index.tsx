import { Box, Stack } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { createFileRoute } from '@tanstack/react-router'

import { FloatingKeyboard, WordsGuesser } from '@/components'

import classes from './index.module.scss'

export const Route = createFileRoute('/')({
  component: BetterWordlePage,
})

function BetterWordlePage() {
  const isXs = useMediaQuery('(max-width: 400px)')

  return (
    <Stack className={classes.stack} h='100%' align='center' justify='center' gap={isXs ? 30 : 50}>
      <Box mah='60rem' style={{ justifySelf: 'start' }}>
        <WordsGuesser />
      </Box>

      <FloatingKeyboard />
    </Stack>
  )
}
