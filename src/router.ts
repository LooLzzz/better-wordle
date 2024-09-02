import { createRouter, createHashHistory } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

const history = createHashHistory()

const router = createRouter({
  routeTree,
  basepath: '/',
  trailingSlash: 'never',
  history,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default router