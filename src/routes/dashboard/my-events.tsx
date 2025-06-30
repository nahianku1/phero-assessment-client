import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/my-events')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/my-events"!</div>
}
