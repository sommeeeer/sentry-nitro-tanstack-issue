# sentry-nitro-tanstack-issue

Multiple source maps are uploaded for one project. Seems to be related to the Sentry plugin and Nitro not working together.

## TODO

- Fill in all `TODO:` placeholders in source files (for this repro, start with `src/router.tsx`).
- Install dependencies:

	```bash
	pnpm install
	```

- Deploy to SST test stage:

	```bash
	pnpm sst deploy --stage test
	```

After deploy visist the `https://domain.com/test` page to trigger an error. See that the sourcemaps is not working.