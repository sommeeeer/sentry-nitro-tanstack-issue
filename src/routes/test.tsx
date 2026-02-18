import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { captureException } from '../router'

export const Route = createFileRoute('/test')({
  component: RouteComponent,
})

function RouteComponent() {
  const handleThrowError = () => {
    const error = new Error('Sourcemap test error from /app/test route')
    captureException(error)
    throw error
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">Sentry Sourcemap Test</h1>
      <p className="text-sm text-muted-foreground">
        Click the button to capture and throw a test error so you can verify
        stack trace mapping in Sentry.
      </p>
      <Button className="cursor-pointer" onClick={handleThrowError}>
        Trigger test error
      </Button>
    </div>
  )
}
