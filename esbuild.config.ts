import esbuild from "esbuild";

esbuild
  .build({
    entryPoints: ["./src/index.ts"], // List your entry files here
    outdir: "./dist", // Specify the output directory
    bundle: true,
    minify: true,
    sourcemap: true,
    platform: "node", // or 'browser' depending on your target
    target: "esnext", // adjust based on the desired JavaScript version
    splitting: true, // Enable code splitting if necessary (for multiple entry points)
    format: "esm", // Ensure output is in ESM format (optional, depends on your use case)
  })
  .catch(() => process.exit(1));
