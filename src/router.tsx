import { createRouter as createTanStackRouter } from '@tanstack/react-router'

import * as Sentry from '@sentry/tanstackstart-react'
import type { AnyRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { getContext } from './integrations/tanstack-query/root-provider'

export function initializeSentry(router: AnyRouter) {
  if (!router.isServer) {
    Sentry.init({
      // TODO:
      // UPDATE THIS TO YOUR DSN FROM SENTRY
      dsn: "https://8edc7d17f0de2e16c3ae00f0c99f2fde@o4510901489893376.ingest.de.sentry.io/4510907345010768",

      // Adds request headers and IP for users, for more info visit:
      // https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/configuration/options/#sendDefaultPii
      sendDefaultPii: true,
    });
  }
}

export function captureException(error: unknown) {
  const normalizedError =
    error instanceof Error ? error : new Error(String(error))
  Sentry.captureException(normalizedError)
}

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    defaultPreload: 'intent',
    context: {
      queryClient: getContext().queryClient,
    },
  })

  initializeSentry(router)

  return router
}
