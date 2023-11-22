const cucumber = require('cypress-cucumber-preprocessor').default
const browserify = require('@cypress/browserify-preprocessor');

module.export = (on, config) => {
const options = {
    ...browserify.defaultOptions,
    typescript: require.resolve('typescript'),
  };
on('file:preprocessor', cucumber(options))
on('task', {
    log(message) {
      console.log(message)

      return null
    },
  })
}