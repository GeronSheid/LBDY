import path from 'path'
import webpack from 'webpack'
import { buildWebpackConfig } from './config/buildWebpackConfig'
import { BuildEnv, BuildPaths } from './config/types/config'

export default (env: BuildEnv) => {

    const paths: BuildPaths = {
        entry: path.resolve(__dirname, 'src', 'index.jsx'),
        build: path.resolve(__dirname, 'build'),
        html: path.resolve(__dirname, 'public', 'index.html'),
        src: path.resolve(__dirname, 'src')
    }

    const mode = env.mode || 'development'
    const isDev = mode === 'development'
    const PORT = env.port || 3000
    const HOST = env.host || '0.0.0.0'

    const config: webpack.Configuration = buildWebpackConfig({
        mode,
        paths,
        isDev,
        port: PORT,
        host: HOST
    })

    return config
}
