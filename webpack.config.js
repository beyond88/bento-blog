const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, options) => {
    // Get source directory from process.argv
    const args = process.argv;
    const srcDirIndex = args.indexOf('--webpack-src-dir');
    const outputPathIndex = args.indexOf('--output-path');
    
    if (srcDirIndex === -1 || outputPathIndex === -1) {
        return defaultConfig;
    }

    const srcDir = args[srcDirIndex + 1];
    const outputPath = args[outputPathIndex + 1];
    
    // Extract block name from srcDir path
    const blockMatch = srcDir.match(/blocks\/([^/]+)/);
    const blockName = blockMatch ? blockMatch[1] : '';

    return {
        ...defaultConfig,
        entry: {
            'index': path.resolve(process.cwd(), srcDir, 'index.js'),
            'style': path.resolve(process.cwd(), srcDir, 'style.scss')
        },
        output: {
            path: path.resolve(process.cwd(), outputPath),
            filename: '[name].js'
        },
        module: {
            ...defaultConfig.module,
            rules: [
                ...defaultConfig.module.rules,
                {
                    test: /\.(sc|sa|c)ss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader'
                    ]
                }
            ]
        },
        plugins: [
            ...defaultConfig.plugins,
            new MiniCssExtractPlugin({
                filename: '[name].css'
            })
        ],
        devServer: {
            ...defaultConfig.devServer,
            port: 3000, // Change this to any available port
            host: 'localhost',
            hot: true,
            watchFiles: {
                paths: [path.resolve(process.cwd(), srcDir, '**/*')],
                options: {
                    usePolling: true
                }
            },
            client: {
                webSocketURL: {
                    hostname: 'localhost',
                    pathname: '/ws',
                    port: 3000  // Same as devServer.port
                },
                reconnect: 5
            }
        }
    };
};