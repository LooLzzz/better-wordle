import {
  CSSVariablesResolver,
  DefaultMantineColor,
  createTheme,
  localStorageColorSchemeManager
} from '@mantine/core'

import { useWordleStore } from '@/hooks'


const colorSchemeManager = localStorageColorSchemeManager({
  key: 'better-wordle-color-scheme',
})

const cssResolver: CSSVariablesResolver = (theme) => {
  const {
    perfect: perfectBlockColor,
    correct: correctBlockColor,
  } = useWordleStore(state => state.blockColors)

  return {
    variables: {
      '--color-letter-state-perfect': perfectBlockColor,
      '--color-letter-state-correct': correctBlockColor,
      '--color-letter-state-incorrect': theme.colors.gray[8],
      '--color-letter-state-incorrect-light': 'var(--mantine-color-dimmed)',
    },

    light: {
      '--mantine-color-body': theme.colors.gray[1],
      '--color-letter-state-incorrect': theme.colors.gray[7],
      '--color-letter-filled-border': 'color-mix(in srgb, var(--mantine-color-default-border), #000 20%)',
      '--color-letter-selected': theme.colors.gray[3],
    },

    dark: {
      '--color-letter-filled-border': 'color-mix(in srgb, var(--mantine-color-default-border), #fff 20%)',
      '--color-letter-selected': theme.colors.gray[7],
    },
  }
}

const theme = createTheme({
  primaryColor: 'indigo' as DefaultMantineColor,

  components: {
    Text: {
      defaultProps: {
        fz: 'inherit',
      },
    },
    Code: {
      defaultProps: {
        fz: 'inherit',
        bg: 'gray',
        c: 'var(--mantine-primary-color-contrast)',
      },
    },
    ActionIcon: {
      defaultProps: {
        // bg: 'var(--mantine-color-body)',
      },
    },
  }
})

export {
  colorSchemeManager,
  cssResolver,
  theme
}
