require('dotenv').config();
const HdWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const deploy = async () => {
    const accountProvider = new HdWalletProvider(
        process.env.ACCOUNT_MNEMONIC,
        process.env.INFURA_RINKEBY_ENDPOINT
    );
    const web3 = new Web3(accountProvider);
    console.log('Getting accounts from web3 provider ...');

    const accounts = await web3.eth.getAccounts();
    console.log('Deploying contract with account', accounts[0]);

    const deployTxnObj = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ["Default message"] })
        .send({ from: accounts[0], gas: '1000000' });
    console.log('Contract deployed to', deployTxnObj.options.address);
    
    accountProvider.engine.stop();
}

deploy();