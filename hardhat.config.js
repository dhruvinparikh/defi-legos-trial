/// ENVVAR
// - ENABLE_GAS_REPORT
// - CI
// - COMPILE_MODE

const fs = require('fs');
const path = require('path');
const argv = require('yargs/yargs')()
  .env('')
  .boolean('enableGasReport')
  .boolean('ci')
  .string('compileMode')
  .argv;

require('@nomiclabs/hardhat-truffle5');
require('@nomiclabs/hardhat-solhint');
require('solidity-coverage');

if (argv.enableGasReport) {
  require('hardhat-gas-reporter');
}

for (const f of fs.readdirSync(path.join(__dirname, 'hardhat'))) {
  require(path.join(__dirname, 'hardhat', f));
}

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: '0.6.10',
    settings: {
      optimizer: {
        enabled: argv.enableGasReport || argv.compileMode === 'production',
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      blockGasLimit: 10000000,
    },
  },
  gasReporter: {
    currency: 'USD',
    outputFile: argv.ci ? 'gas-report.txt' : undefined,
  },
};
