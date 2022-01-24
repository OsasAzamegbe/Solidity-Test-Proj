// contract test code will go here
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { interface, bytecode } = require('../compile');

const web3 = new Web3(ganache.provider());


const INITIAL_MESSAGE = 'Hello there stranger!';
let accounts;
let inbox;

const assertMessageEqual = async (message) => {
    const actualMessage = await inbox.methods.message().call();
    assert.equal(message, actualMessage);
};


beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: [INITIAL_MESSAGE] })
        .send({ from: accounts[0], gas: '1000000' });
});

describe('InboxTest', () => {
    it('contract is deployed', () => {
        assert.ok(inbox.options.address);
    });

    it('initial message is set', async () => {
        assertMessageEqual(INITIAL_MESSAGE);
    });

    it('message is correct after update', async () => {
        const newMessage = 'Say hello to my little friend :)';
        await inbox.methods.setMessage(newMessage).send({from: accounts[0]});
        assertMessageEqual(newMessage);
    });
})