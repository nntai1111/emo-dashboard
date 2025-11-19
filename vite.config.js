import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwind from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import viteCompression from "vite-plugin-compression";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwind(),
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 1024,
      deleteOriginFile: false,
    }),
    visualizer({
      filename: "./dist/bundle-report.html",
      title: "Bundle Analysis",
      gzipSize: true,
      brotliSize: true,
      template: "treemap",
    }),
  ],
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    sourcemap: true, // thêm dòng này
    target: "es2020",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Manual chunking: keep heavy animation/UI libs in their own chunks,
        // but avoid isolating React into a separate chunk. In some production
        // environments the wrapper/interop between chunks can cause a
        // momentary undefined exports object which leads to runtime errors
        // like `Cannot set properties of undefined (setting 'Activity')`.
        // To prevent that, fold React into the general `vendor_misc` chunk.
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("framer-motion") || id.includes("gsap"))
              return "vendor_motion";
            if (
              id.includes("primereact") ||
              id.includes("react-icons") ||
              id.includes("lucide-react")
            )
              return "vendor_ui";
            if (id.includes("@tsparticles") || id.includes("tsparticles"))
              return "vendor_particles";
            // Do NOT create a dedicated `vendor_react` chunk; let React be
            // included in vendor_misc to avoid cross-chunk export wrapper
            // timing/interop issues in production.
            return "vendor_misc";
          }
        },
      },
    },
  },
}));
