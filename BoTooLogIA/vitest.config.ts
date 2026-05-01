import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts", "app/**/*.test.ts"],
    exclude: ["node_modules", ".next", "generated", "**/node_modules/**"],
    globals: true,
    pool: "forks",
    poolOptions: {
      forks: { singleFork: true },
    },
    env: {
      SKIP_ENV_VALIDATION: "1",
      DATABASE_URL: "postgresql://postgres:postgres@127.0.0.1:5432/test",
      NEXTAUTH_SECRET: "test-secret-32-chars-minimum-ok!",
      JWT_SECRET: "test-jwt-secret-32-chars-minimum!",
    },
    coverage: {
      provider: "v8",
      include: [
        "lib/env-validation.ts",
        "lib/db-error-handler.ts",
        "lib/middleware/rate-limit-policies.ts",
        "lib/middleware/rate-limit.ts",
        "lib/middleware/rate-limit-store.ts",
        "lib/api/with-api-error-handler.ts",
        "lib/api/response.ts",
      ],
      exclude: ["**/*.test.ts", "**/generated/**"],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
