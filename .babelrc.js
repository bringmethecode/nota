const devEnv = process.env.NODE_ENV === 'development'
const prodEnv = process.env.NODE_ENV === 'production'

const presets = [
  [
    '@babel/preset-env',
    {
      targets: {
        "node": "current",
        "browsers": ["last 2 Chrome versions"]
      },
      useBuiltIns: 'usage'
    }
  ],
  [
    '@babel/preset-react',
    {
      development: devEnv
    }
  ]
]

const plugins = [
  [
    '@babel/plugin-proposal-class-properties',
    {
      loose: true
    }
  ],
  '@babel/plugin-proposal-throw-expressions',
]

if (devEnv) {
  const devPlugins = [
    'react-hot-loader/babel'
  ]
  plugins.concat(devPlugins)
}

if (prodEnv) {
  const reactOptimizePreset = [
    '@babel/plugin-transform-react-constant-elements',
    '@babel/plugin-transform-react-inline-elements',
    'transform-react-remove-prop-types'
  ]  
  const prodPlugins = [
    ...reactOptimizePreset
  ]
  plugins.concat(prodPlugins)
}

module.exports = { presets, plugins }
