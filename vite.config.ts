import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx'
import unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import viteImagemin from 'vite-plugin-imagemin'
import viteCompression from 'vite-plugin-compression'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
export default ({ mode }: any) => {
  return defineConfig({
    plugins: [vue(), vueJsx(), unocss({
      rules: [
        [/^m-(\d+)$/, ([, d]) => ({ margin: `${Number(d) * 1}px` })],
        [/^m-l-(\d+)$/, ([, d]) => ({ 'margin-left': `${Number(d) * 1}px` })],
        ['flex', { display: 'flex' }],
        ['pink', { color: 'pink' }]
      ],
      shortcuts: {
        btn: "pink flex"
      },
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),

    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7
      },
      mozjpeg: {
        quality: 20
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4
      },
      svgo: {
        plugins: [
          { name: 'removeViewBox' },
          { name: 'removeEmptyAttrs', active: false }
        ]
      }
    }),
    viteCompression({
      //生成压缩包gz
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz'
    }),
    // 使用svgicon
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src/')
      }
    },
    server: {
      proxy: {
        '/api': {
          target: loadEnv(mode, process.cwd()).VITE_API,
          changeOrigin: true, //支持跨域
          rewrite: (path) => path.replace(/^\/api/, "") //重写路径，替代/api
        }
      }
    },
    build: {
      chunkSizeWarningLimit: 2000,
      cssCodeSplit: true, //CSS拆分
      sourcemap: false,   //不生产sourcemap
      minify: 'terser',      //是否禁用最小化混淆，esbuild打包速度最快，terser打包体积最小
      assetsInlineLimit: 5000, //小于该值 图片将打包成Base64
      terserOptions: {
        compress: {
          // 生产环境时移除console
          drop_console: true,
          drop_debugger: true
        }
      },
      // rollup打包后的静态资源名称格式
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    css: {
      //css预处理器
      preprocessorOptions: {
        less: {
          charset: false,
          additionalData: '@import "./src/assets/styles/varLess.less";'
        }
      }
    }
  })
}
