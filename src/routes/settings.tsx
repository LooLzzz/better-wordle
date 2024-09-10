import { ActionIcon, Box, Center, ColorSwatch, DEFAULT_THEME, Divider, Group, Input, Overlay, Stack, Tooltip } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconCheck, IconRefresh, IconReload } from '@tabler/icons-react'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { GuessBlock, LetterState } from '@/components/WordsGuesser/Guess'
import { useWordleStore } from '@/hooks'
import { generateRandomWord, initialState } from '@/hooks/store'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})


function SettingsPage() {
  const [
    blockColors,
    setBlockColor,
  ] = useWordleStore((state) => [
    state.blockColors,
    state.setBlockColor,
  ])
  const isSm = useMediaQuery('(max-width: 768px)')
  const letterStatesOptions: LetterState[] = ['perfect', 'correct', 'incorrect', undefined]
  const [[word, letterStates], setLetterStates] = useState<[string, LetterState[]]>(['', []])

  const refreshLetterStates = () => {
    setLetterStates([
      generateRandomWord(),
      [
        letterStatesOptions[Math.floor(Math.random() * letterStatesOptions.length)],
        letterStatesOptions[Math.floor(Math.random() * letterStatesOptions.length)],
        letterStatesOptions[Math.floor(Math.random() * letterStatesOptions.length)],
        letterStatesOptions[Math.floor(Math.random() * letterStatesOptions.length)],
        letterStatesOptions[Math.floor(Math.random() * letterStatesOptions.length)],
      ]
    ])
  }

  const correctSwatches = [
    DEFAULT_THEME.colors.yellow[9],
    DEFAULT_THEME.colors.orange[8],
    DEFAULT_THEME.colors.pink[8],
    DEFAULT_THEME.colors.grape[9],
  ]

  const perfectSwatches = [
    DEFAULT_THEME.colors.green[9],
    DEFAULT_THEME.colors.lime[8],
    DEFAULT_THEME.colors.cyan[8],
    DEFAULT_THEME.colors.indigo[7],
  ]

  useEffect(() => {
    refreshLetterStates()
  }, [])

  return (
    <Center p='xs' pt='5rem'>
      <Stack>
        <Box component={isSm ? Center : undefined as any}>
          <Input.Wrapper label='Correct Block Color'>
            <Group gap='0.3rem'>
              {
                correctSwatches.map((color) => (
                  <ColorSwatch
                    key={color}
                    color={color}
                    size={isSm ? '1.75rem' : '2.25rem'}
                    radius='sm'
                    onClick={() => setBlockColor('correct', color)}
                    style={{ cursor: 'pointer' }}
                  >
                    {
                      color === blockColors.correct &&
                      <Overlay component={Center} backgroundOpacity={0}>
                        <IconCheck stroke={4} size='1rem' color='white' />
                      </Overlay>
                    }
                  </ColorSwatch>
                ))
              }
              <Tooltip withArrow label='Reset'>
                <ActionIcon variant='default' onClick={() => setBlockColor('correct', initialState.blockColors.correct)}>
                  <IconReload size='1rem' />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Input.Wrapper>
        </Box>

        <Box component={isSm ? Center : undefined as any}>
          <Input.Wrapper label='Perfect Block Color'>
            <Group gap='0.3rem'>
              {
                perfectSwatches.map((color) => (
                  <ColorSwatch
                    key={color}
                    color={color}
                    size={isSm ? '1.75rem' : '2.25rem'}
                    radius='sm'
                    onClick={() => setBlockColor('perfect', color)}
                    style={{ cursor: 'pointer' }}
                  >
                    {
                      color === blockColors.perfect &&
                      <Overlay component={Center} backgroundOpacity={0}>
                        <IconCheck stroke={4} size='1rem' color='white' />
                      </Overlay>
                    }
                  </ColorSwatch>
                ))
              }
              <Tooltip withArrow label='Reset'>
                <ActionIcon variant='default' onClick={() => setBlockColor('perfect', initialState.blockColors.perfect)}>
                  <IconReload size='1rem' />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Input.Wrapper>
        </Box>

        <Divider />

        <Input.Wrapper label='Preview'>
          <Group gap='xs' align='center' justify='center'>
            {
              word.split('').map((letter, index) => (
                <GuessBlock
                  key={index}
                  letter={letter}
                  letterState={letterStates[index]}
                />
              ))
            }

            <Tooltip withArrow label='Refresh Letters'>
              <ActionIcon variant='default' onClick={refreshLetterStates}>
                <IconRefresh size='1rem' />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Input.Wrapper>
      </Stack>
    </Center>
  )
}
