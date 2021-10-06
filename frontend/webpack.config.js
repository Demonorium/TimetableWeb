const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')
module.exports = {
    mode: 'none',
    entry: {
        app: path.join(__dirname, 'src', 'index.tsx')
    },
    target: 'web',
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    devServer: {
        host: 'localhost',
        port: 3000,
        historyApiFallback: true,
        proxy: {
            '/api': {
                target: "http://localhost:8080/"
            },
            '/user': {
                target: "http://localhost:8080/"
            },
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.svg$/,
                use: 'svg-inline-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.css$/,
                use: ["style-loader", 'css-loader'],
                exclude: '/node_modules/'
            }
        ],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.html')
        })
    ]
}
