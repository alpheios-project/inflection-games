import VueLoaderPlugin from '../node_modules/vue-loader/lib/plugin.js'

import path from 'path'
const projectRoot = process.cwd()


const webpack = {
  common: {
    entry: './index.js',
    resolve: {
      alias: {
        'alpheios-data-models': path.join(projectRoot, 'node_modules/alpheios-data-models/dist/alpheios-data-models.js'),
        'alpheios-inflection-tables': path.join(projectRoot, 'node_modules/alpheios-inflection-tables/dist/alpheios-inflection-tables.js'),
        'alpheios-client-adapters': path.join(projectRoot, 'node_modules/alpheios-client-adapters/dist/alpheios-client-adapters.js'),
        '@': path.join(projectRoot, 'src')
      }
    },
    externals: {
      'alpheios-data-models': 'alpheios-data-models',
      'intl-messageformat': 'intl-messageformat',
      'uuid': 'uuid'
    },
    plugins: [
      new VueLoaderPlugin()
    ]
  },

  production: {
    mode: 'production',
    output: {filename: 'alpheios-inflection-games.min.js'}
  },

  development: {
    mode: 'development',
    output: {filename: 'alpheios-inflection-games.js'}
  }
}

export { webpack }
