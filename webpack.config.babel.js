import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { DefinePlugin } from 'webpack';



export default (env, argv) => ({
    entry: {
        index: path.join(__dirname, './src/index.tsx')
    },
    output: {
        filename: "bundle.js",
        path: path.join(__dirname, './dist'),
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                include: path.join(__dirname, './src'),
                use: ['babel-loader', 'awesome-typescript-loader']
            },
            {
                test: /\.scss$/,
                include: path.join(__dirname, './src'),
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', {
                        loader: 'sass-loader',
                        options: {
                            includePaths: [path.join(__dirname, './src')]
                        }
                    }]
                })
            },
            {
                test: /\.(?:png|jpg|svg)$/,
                loader: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'images'
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.d.ts', '.js', '.scss']
    },
    plugins: [
        new ExtractTextPlugin('bundle.css'),
        new DefinePlugin({
            MODE: JSON.stringify(argv.mode)
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, './src'),
        compress: true,
        port: 8080
    }
});