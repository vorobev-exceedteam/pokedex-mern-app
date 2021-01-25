const { override, disableEsLint, addDecoratorsLegacy } = require('customize-cra');
// const pluginProposalDecorators = require('@babel/plugin-proposal-decorators');
// const proposalClassProperties = require('@babel/plugin-proposal-class-properties');
// const legacyDecoratorTransformer = require('babel-plugin-transform-decorators-legacy')

module.exports = override(addDecoratorsLegacy());
