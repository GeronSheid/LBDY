import { BuildOptions } from "./types/config";
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";

export function buildDevServer(options: BuildOptions): DevServerConfiguration {
    return {
        port: options.port,
        open: true,
        historyApiFallback:
        {
            index: '/platform/'
        },
        hot: true,
        static: 'src',
        host: options.host,
        // allowedHosts: ['lbdy.ru']
    }
}
