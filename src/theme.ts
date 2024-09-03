import { CSSVariablesResolver, DefaultMantineColor, createTheme, localStorageColorSchemeManager } from '@mantine/core'


const colorSchemeManager = localStorageColorSchemeManager({
  key: 'better-wordle-color-scheme',
})

const cssResolver: CSSVariablesResolver = (theme) => ({
  variables: {
    '--color-letter-state-perfect': theme.colors.green[9],
    '--color-letter-state-correct': theme.colors.yellow[9],
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
})

const theme = createTheme({
  primaryColor: 'indigo' as DefaultMantineColor,

  components: {
    Text: {
      defaultProps: {
        fz: 'inherit',
      }
    },
    Code: {
      defaultProps: {
        bg: 'gray',
        c: 'var(--mantine-primary-color-contrast)',
      }
    }
  }
})

export {
  colorSchemeManager,
  cssResolver,
  theme
}
