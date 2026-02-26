import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import { sentryTanstackStart } from "@sentry/tanstackstart-react";
import SentryCli from '@sentry/cli';
import { readdir, rm } from "node:fs/promises";
import { join, resolve } from "node:path";

async function deleteSourceMaps(dir: string) {
  const entries = await readdir(dir, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        await deleteSourceMaps(entryPath);
        return;
      }

      if (entry.isFile() && entry.name.endsWith(".map")) {
        await rm(entryPath, { force: true });
      }
    }),
  );
}

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
      // sourcemaps: {
      //   // SST uses the `.output/public` folder as static asssets:
      //   // https://github.com/sst/sst/blob/432418a2bb8/platform/src/components/aws/tan-stack-start.ts#L409
      //   assets: ["./.output/**/*"],
      //   ignore: ["**/node_modules/**"],
      //   filesToDeleteAfterUpload: ["./.output/**/*.map"],
      // },
      // debug: true,
      sourcemaps: {
        disable: true,
      }
    }),
  ],
nitro: {
  sourcemap: true,
  preset: "aws-lambda",
  awsLambda: {
    streaming: true,
  },
  hooks: {
    compiled: async () => {
      const outputDir = resolve(process.cwd(), ".output/public/");

      const sentryCli = new SentryCli(null, {
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: "testappliaction",
        project: "javascript-tanstackstart-react",
      });

      await sentryCli.execute(["sourcemaps", "inject", outputDir], true);
      await sentryCli.execute(["sourcemaps", "upload", outputDir], true);

      await deleteSourceMaps(outputDir);
    }
  }
  },
});

export default config;
