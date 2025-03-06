/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/dev/': {
      target: 'http://11.113.1.50:7085/',
      changeOrigin: true,
      pathRewrite: { '^/dev': '/ai-teach' },
      onProxyReq(proxyReq:any){
        proxyReq.removeHeader('origin')
      }
    },
  },
  // test: {
  //   '/api/': {
  //     target: 'https://proapi.azurewebsites.net',
  //     changeOrigin: true,
  //     pathRewrite: { '^': '' },
  //   },
  // },
  // pre: {
  //   '/api/': {
  //     target: 'your pre url',
  //     changeOrigin: true,
  //     pathRewrite: { '^': '' },
  //   },
  // },
};
