// webpack.config.js
import path from 'path';

export default {
  mode: 'production',
  entry: './src/index.js',
  output: {
    // Penting: Gunakan [name] dan [contenthash] agar Webpack membuat nama file unik untuk setiap chunk
    filename: '[name].[contenthash].bundle.js',
    path: path.resolve(process.cwd(), 'dist'),
    library: {
      type: 'module',
    },
  },
  experiments: {
    outputModule: true,
  },
  resolve: {
    fallback: {
      fs: false,
      child_process: false,
      path: 'path-browserify',
      os: 'os-browserify/browser',
      stream: 'stream-browserify',
      zlib: 'browserify-zlib',
      https: 'https-browserify',
      http: 'stream-http',
      crypto: 'crypto-browserify',
      assert: 'assert',
      url: 'url',
    },
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
    ],
  },
  externals: {
    canvas: 'commonjs canvas', // Pertahankan ini jika Anda menjalankan di Node.js
  },
  optimization: {
    minimize: true,
    // splitChunks TIDAK diperlukan di sini karena dynamic imports sudah cukup memicu chunking
  },
  ignoreWarnings: [
    /Critical dependency: the request of a dependency is an expression/,
  ],
};