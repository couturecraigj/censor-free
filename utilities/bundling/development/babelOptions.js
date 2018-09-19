module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    // ["@babel/plugin-proposal-decorators", { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-object-rest-spread',
    // "react-hot-loader/babel",
    'loadable-components/babel'
  ]
};
