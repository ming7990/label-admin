// https://umijs.org/config/
import { defineConfig } from 'umi';

export default defineConfig({
  plugins: [
    // https://github.com/zthxxx/react-dev-inspector
    'react-dev-inspector/plugins/umi/react-inspector',
  ],
  // https://github.com/zthxxx/react-dev-inspector#inspector-loader-props
  inspectorConfig: {
    exclude: [],
    babelPlugins: [],
    babelOptions: {},
  },
  define: {
    'process.env.API_SUCCESS_CODE': '100', // 成功编码
    'process.env.websocket_url': 'localhost:4000/websocket', // websocket服务
    'process.env.register_url': '@11.112.0.42:5070', // 信令服务器注册
    'process.env.ws_url': '11.112.0.42:5066', // 语音通讯 ws 服务  页面部署在http的情况
    'process.env.wss_url': '11.112.0.42:7443', // 语音通讯 wss 服务 页面部署在https的情况
    'process.env.fs_password': 'yiwise',
  },
});
