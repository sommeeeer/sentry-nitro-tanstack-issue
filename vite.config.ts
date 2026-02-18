import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import { sentryTanstackStart } from "@sentry/tanstackstart-react";

const config = defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    devtools(),
    nitro(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    sentryTanstackStart({
      org: "testappliaction",
      project: "javascript-tanstackstart-react",
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        // SST uses the `.output/public` folder as static asssets:
        // https://github.com/sst/sst/blob/432418a2bb8/platform/src/components/aws/tan-stack-start.ts#L409
        assets: ["./.output/**/*"],
        ignore: ["**/node_modules/**"],
        filesToDeleteAfterUpload: ["./.output/**/*.map"],
      },
      debug: true,
    }),
  ],
  nitro: {
    sourcemap: true,
    preset: "aws-lambda",
    awsLambda: {
      streaming: true,
    },
  },
});

export default config;
