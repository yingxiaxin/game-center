var path = require("path")

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    target: 'node',
    entry: {
        main: "./src/index.js", //属性名：chunk的名称， 属性值：入口模块（启动模块）
    },
    output: {
        path: path.resolve(__dirname, "dsit"), //必须配置一个绝对路径，表示资源放置的文件夹，默认是dist
        filename: "[name].[chunkhash:5].js" //配置的合并的js文件的规则
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            }
        ]
    }
}