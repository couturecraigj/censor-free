module.exports = {
  presets: ['@babel/preset-react'],
  plugins: [
    [
      'babel-plugin-styled-components',
      {
        displayName: false
      }
    ],
    'graphql-tag',
    '@babel/plugin-proposal-optional-chaining',
    // ["@babel/plugin-proposal-decorators", { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-object-rest-spread',
    [
      '@babel/plugin-proposal-object-rest-spread',
      {
        loose: true,
        useBuiltIns: true
      }
    ],
    'transform-react-remove-prop-types',
    // "react-hot-loader/babel",
    'loadable-components/babel'
  ]
};
