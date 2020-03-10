module.exports = {
    lintOnSave: false,
    publicPath: 'site',
    outputDir: 'site', // 构建输出目录
    devServer: {
        port: 8092, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        proxy: {
            '/api': {
                // target: 'http://172.16.2.29:9001',
                target: 'http://127.0.0.1:9081',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': '/'
                }
            },
        }
    },

}
