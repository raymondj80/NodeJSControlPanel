const { defineConfig } = require('@vue/cli-service')
const path = require('path');

module.exports = {
  devServer: {
    proxy: {
        '/': {
          target: 'http://localhost:3000'
      }
    }
  }
}

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
})
