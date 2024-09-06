import { fileURLToPath, URL } from 'node:url'
//引用svg需要用到插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'node:path'
//mock插件提供方法
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig(({ command,mode }) => {
  //获取各种环境下对应的变量
  let env = loadEnv(mode,process.cwd());
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      viteMockServe({
        enable: command === 'serve',
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    //scss全局变量配置项
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
    //代理跨域
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]:{
          //获取数据的服务器地址设置
          target: env.VITE_SERVE,
          //需要代理跨域
          changeOrigin: true,
          //路径重写
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        [env.VITE_APP_BASE_INFO_API]:{
          //获取数据的服务器地址设置
          target: env.VITE_INFO_SERVE,
          //需要代理跨域
          changeOrigin: true,
          //路径重写
          rewrite: (path) => path.replace(/^\/info/, ''),
        }
      }
    }
  }
})
