var CopyWebpackPlugin = require('copy-webpack-plugin')
var path = require('path')
var json = require('./package.json')
module.exports = {
    entry: './src/index.ts',
    output: {
        path: __dirname + '/public',
        filename: 'js/fastfork.js',
        publicPath: '/'
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'node_modules/bootstrap/dist/css/bootstrap.min.css', to: 'css/bootstrap.min.css' },
            { from: 'node_modules/bootstrap/dist/js/bootstrap.min.js', to: 'js/3rdparty/bootstrap.min.js' },
            { from: 'node_modules/bootstrap/fonts', to: 'fonts', toType: 'dir' },
            { from: 'node_modules/bootstrap-table/dist/bootstrap-table.css', to: 'css/bootstrap-table.css' },
            { from: 'node_modules/bootstrap-table/dist/bootstrap-table.js', to: 'js/3rdparty/bootstrap-table.js' },
            { from: 'node_modules/github-api/dist/Github.bundle.js', to: 'js/3rdparty/Github.js' },
            { from: 'node_modules/jquery/dist/jquery.min.js', to: 'js/3rdparty/jquery.min.js' },
            { from: 'node_modules/requirejs/require.js', to: 'js/3rdparty/require.js' }

        ])
    ],
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
}