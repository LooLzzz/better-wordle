import { Center } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/helper')({
  component: HelperPage,
})

function HelperPage() {
  return (
    <Center>
      <h3>TBD</h3>
    </Center>
  )
}
