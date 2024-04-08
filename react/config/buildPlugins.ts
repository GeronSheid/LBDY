import path from 'path'
import HtmlWebpackPlugin from "html-webpack-plugin"
import webpack, { DefinePlugin } from "webpack"
import { BuildOptions } from "./types/config"
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import {BundleAnalyzerPlugin} from "webpack-bundle-analyzer";
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
const dotenv = require('dotenv');

export function buildPlugins({paths, isDev}: BuildOptions): webpack.WebpackPluginInstance[] {

    let mode = isDev ? 'development' : 'production';
    
    const env = dotenv.config({path: `.env.${mode}`}).parsed;

    const envKeys = Object.keys(env).reduce((prev : any, next: any) => {
        prev[`process.env.${next}`] = JSON.stringify(env[next]);
        return prev;
    }, {});

    return [
        new HtmlWebpackPlugin({
            template: paths.html
        }),
        new webpack.ProgressPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css',
            chunkFilename: 'css/[name].[contenthash:8].css'
        }),
        new webpack.HotModuleReplacementPlugin(),
        // new BundleAnalyzerPlugin({
        //     openAnalyzer: false
        // }),
        new FaviconsWebpackPlugin('./public/favicon.png'),
        new webpack.DefinePlugin(envKeys)
    ]
}
