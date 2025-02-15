import esbuild from "esbuild";
import { copy } from "esbuild-plugin-copy";

async function build() {
  await esbuild.build({
    entryPoints: ["./src/app.ts"],
    bundle: true,
    format: "cjs",
    outdir: "./dist",
    outExtension: { ".js": ".cjs" },
    platform: "node",
    target: "node20",
    minify: false,
    keepNames: true,
    plugins: [
      copy({
        assets: [
          {
            from: ["./node_modules/swagger-ui-dist/*"],
            to: ["./"],
          },
        ],
      }),
    ],
  });
}

build();
