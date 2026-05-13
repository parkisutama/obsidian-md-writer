import { parseArgs } from "node:util";
import { build } from "./lib/build";
import { deployPlugin } from "./lib/deploy-plugin";
import { setupTestVault } from "./lib/setup-test-vault";

const { values: args } = parseArgs({
  args: process.argv.slice(2),
  options: {
    debug: {
      type: "boolean",
    },
  },
  strict: true,
  allowPositionals: true,
});

await build({ stripDebug: !args.debug });

setupTestVault("./dist", "md-writer", "./test-vault");
deployPlugin();
