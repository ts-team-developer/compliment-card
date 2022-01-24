const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app){
  app.use(
      createProxyMiddleware(['/auth', '/api','/view','/main'], {
          target: 'http://localhost:3001',
          changeOrigin: true
      })
  )
};