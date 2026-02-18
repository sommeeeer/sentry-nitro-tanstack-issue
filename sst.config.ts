/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "aws-tanstack-start",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    new sst.aws.TanStackStart("MyWeb", {
      environment: {
        // TODO: UPDATE THIS TO YOUR TOKEN FROM SENTRY
        // DONT DO THIS IN PROD :D
        SENTRY_AUTH_TOKEN: "YOUR_TOKEN_HERE",
      }
    });
  },
});
