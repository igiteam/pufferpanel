import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import eslint from "vite-plugin-eslint"
import vueI18n from '@intlify/unplugin-vue-i18n/vite'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  // ============= ADD THIS LINE - CRITICAL FOR SUBDIRECTORY SUPPORT =============
  base: '/pufferpanel/',  // Change this to your desired subpath
  
  build: {
    sourcemap: true,  
    chunkSizeWarningLimit: 550,
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash][extname]'
      }
    }
  },
  resolve: {
    alias: [
      {find: "@", replacement: path.resolve(__dirname, 'src')}
    ]
  },
  define: {
    localeList: fs.readdirSync('src/lang')
  },
  plugins: [
    vue(),
    vueI18n({
      runtimeOnly: false,
      include: path.resolve(__dirname, '@/lang/**')
    }),
    eslint()
  ]
})

// This is Go's embed feature. It compiles the entire frontend (HTML, JS, CSS) directly into the .go binary file.
// What this means:
// Source Code                           Built Binary
// ─────────────────────────────────────────────────────────────
// client/frontend/public/               pufferpanel (executable)
// ├── index.html      ──┐               ├── embedded index.html
// ├── js/             ──┼─── embed ───►├── embedded js/
// ├── css/            ──┘               ├── embedded css/
// └── ...                               └── embedded ...

// The binary contains the hardcoded asset paths. You cannot modify them without rebuilding.

// Great question! Go (Golang) is actually very popular for infrastructure and DevOps tools. Here's why PufferPanel (and many others) use Go:
// Why Go is popular for this type of app:
// 1. Single Binary Deployment
// # One file. That's it.
// ./pufferpanel  # Runs everywhere. No dependencies.

// No Python, no Node.js, no Java runtime needed. Just download and run.
// 2. Embedded Filesystem (What's causing your problem)

// // This entire web folder becomes PART of the binary
// //go:embed client/frontend/public/*
// var webFiles embed.FS

// Everything is self-contained. No separate HTML/CSS/JS files to manage.
// 3. Cross-compilation

// # Build for Windows, Linux, Mac, ARM all from one command
// GOOS=linux go build   # Linux binary
// GOOS=windows go build # Windows .exe
// GOOS=darwin go build  # Mac binary

// 4. Performance
// Go is extremely fast - near C speed with garbage collection. Perfect for game servers handling many connections.
// 5. Built-in Concurrency
// // Handling 1000 game server instances simultaneously
// go startServer()  // Super lightweight threads

// Other popular Go apps you've probably used:
// App	What it does	Why Go?
// Docker	Containers	Performance + cross-platform
// Kubernetes	Container orchestration	Scalability
// Terraform	Infrastructure	Single binary deployment
// Prometheus	Monitoring	Efficiency
// Traefik	Reverse proxy	Speed + simplicity
// Caddy	Web server with auto HTTPS	Easy deployment
// Syncthing	File sync	Cross-platform
// Hugo	Static site generator	Blazing fast builds
// Go vs Other Languages:
// Language	Binary Size	Memory	Ease of deployment	Speed
// Go	10-20 MB	Low	❄️ ONE file	🚀 Fast
// Node.js	+100 MB (runtime)	High	❌ Needs npm	🐢 Slower
// Python	+50 MB (runtime)	High	❌ Needs pip	🐢 Slow
// Java	+200 MB (JVM)	Very High	❌ Needs JRE	🚀 Fast but heavy
// Rust	5-10 MB	Tiny	ONE file	🚀🚀 Fastest
// Why PufferPanel specifically chose Go:

//     Game servers need performance - Go handles many concurrent connections
//     Easy to distribute - One binary for all platforms
//     Built-in HTTP server - No Apache/Nginx needed (though they still use it)
//     Docker integration - Go has excellent Docker API libraries
//     The developer knew Go - Simple as that
// The downside (what you're experiencing):
// Customization is hard. You can't just edit an HTML file - you have to rebuild the whole binary.

// That's why your PufferPanel customization is so difficult compared to Forgejo (written in Go too, but they added proper subpath support) or VSCode (Node.js, easy to customize).

// So Go is great for distribution but terrible for on-the-fly customization. Tradeoffs!