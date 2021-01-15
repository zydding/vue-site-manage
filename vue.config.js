module.exports = {
    lintOnSave: false,
    publicPath: 'site',
    outputDir: 'site', // 构建输出目录
    devServer: {
        port: 8092,
        proxy: {
            '/api': {
                target: 'https://zekeup.com/',
                // target: 'http://127.0.0.1:9081/',
                changeOrigin: true,
                ws: true,
                // pathRewrite: {
                //     '^/api': '/'
                // }
            },
        }
    },

}
