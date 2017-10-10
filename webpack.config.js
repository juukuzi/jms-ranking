/**
 * @fileOverview this configuration file is used only for testing.
 */

module.exports = {
    entry: './test/test.ts',
    output: {
        filename: './out/test-bundle.js'
    },
    devtool: 'source-map',
    resolve: {
        extensions: [ '.ts', '.js', ]
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                use: [
                    { loader: 'ts-loader' },
                ]
            }
        ]
    }
};
