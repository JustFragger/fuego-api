# Fuego-API: Javascript/Node.js interface (RPC/API)
Javascript/Node.js interface to Fuego cryptocurrency RPC/API.

There are three RPC servers built in to the three programs *fuegod*, *Fuegowallet* and *walletd*.
They can each be started with the argument `--help` to display command line options.

### Fuegod
A node on the P2P network (daemon) with no wallet functions; console interactive. To launch:
```
$ ./fuegod
```
The default daemon RPC port is 18180 and the default P2P port is 10808.
### walletd
A node on the P2P network (daemon) with wallet functions; console non-interactive. To launch, assuming that your `my.wallet` file is in the current directory:
```
$ ./walletd --container-file my.wallet --container-password PASSWD --local --bind-port 18181
```
The wallet functions RPC port is 18181. The default daemon P2P port is 10808. The default daemon RPC port is 18180. The `--local` option activates the daemon; otherwise, a remote daemon can be used.
### Fuegowallet
A simple wallet; console interactive unless RPC server is running; requires access to a node daemon for full functionality. To launch, assuming that your `my.wallet` file is in the current directory:
```
$ ./Fuegowallet --rpc-bind-port 8070 --wallet-file my --password PASSWORD
```
The wallet functions RPC port is 8070. By default the wallet connects with the daemon on port 18180. It is possible to run several instances simultaneously using different wallets and ports.
## Quick start for node.js
```
$ npm install Fuego-api
$ ./fuegod # launch the network daemon
$ ./Fuegowallet --rpc-bind-port PORT --wallet-file my --password PASSWORD # launch the simple wallet
```
Create and run a test program.
```
$ node test.js
```
The test program could contain, for example, a payment via the simple wallet's RPC server
```
const XFG = require('fuego-api')
const ccx = new XFG({
  daemonHost: 'http://localhost', 
  walletHost: 'http://localhost', 
  daemonRpcPort: 18180,
  walletRpcPort: 8070
})

fuego.send([{
  address: 'fireCd9BNW6UYQnFbTZ8XFKr8Xfcxc9HJUMu7J6HJxnwDvjvjPUko2yXSeAZQCUbV7CxdR7rJKX63HDhDjzWxWCNA5iYhbHSjz',
  amount: 1234567
}])
.then((res) => { console.log(res) }) // display tx hash upon success
.catch((err) => { console.log(err) }) // display error message upon failure
```
## API
```
const XFG = require('Fuego-api')
const xfg = new XFG({
  daemonHost: <daemonHost>, 
  walletHost: <walletHost>,
  daemonRpcPort: <daemonRpcPort>,
  walletRpcPort: <walletRpcPort>,
  timeout: <timeout>
})
```
xfg.rpc returns a promise, where *rpc* is any of the methods below:

* [Wallet RPC (must provide walletRpcPort)](#wallet)
  * Fuegowallet
    * [Get height](#height)
    * [Get balance](#balance)
    * [Get messages](#messages)
    * [Get incoming payments](#payments)
    * [Get transfers](#transfers)
    * [Get number of unlocked outputs](#outputs)
    * [Reset wallet](#reset)
    * [Store wallet](#store)
    * [Optimize wallet](#optimize)
    * [Send transfers](#send)
  * walletd
    * [Reset or replace wallet](#resetOrReplace)
    * [Get status](#status)
    * [Get balance](#getBalance)
    * [Create address](#createAddress)
    * [Delete address](#deleteAddress)
    * [Get addresses](#getAddresses)
    * [Get view secret Key](#getViewSecretKey)
    * [Get spend keys](#getSpendKeys)
    * [Get block hashes](#getBlockHashes)
    * [Get transaction](#getTransaction)
    * [Get unconfirmed transactions](#getUnconfirmedTransactions)
    * [Get transaction hashes](#getTransactionHashes)
    * [Get transactions](#getTransactions)
    * [Send transaction](#sendTransaction)
    * [Create delayed transaction](#createDelayedTransaction)
    * [Get delayed transaction hashes](#getDelayedTransactionHashes)
    * [Delete delayed transaction](#deleteDelayedTransaction)
    * [Send delayed transaction](#sendDelayedTransaction)
    * [Get incoming messages from transaction extra field](#getMessagesFromExtra)
* [Daemon RPC (must provide daemonRpcPort)](#daemon)
  * [Get info](#info)
  * [Get index](#index)
  * [Get count](#count)
  * [Get currency ID](#currencyId)
  * [Get block hash by height](#blockHashByHeight)
  * [Get block header by height](#blockHeaderByHeight)
  * [Get block header by hash](#blockHeaderByHash)
  * [Get last block header](#lastBlockHeader)
  * [Get block](#block)
  * [Get blocks](#blocks)
  * [Get block template](#blockTemplate)
  * [Submit block](#submitBlock)
  * [Get transaction](#transaction)
  * [Get transactions](#transactions)
  * [Get transaction pool](#transactionPool)
  * [Send raw transaction](#sendRawTransaction)

### <a name="wallet"></a>Wallet RPC (must provide walletRpcPort)

#### <a name="height"></a>Get height (Fuegowallet)
```
xfg.height() // get last block height
```
#### <a name="balance">Get balance (Fuegowallet)
```
xfg.balance() // get wallet balances
```
#### <a name="messages">Get messages (Fuegowallet)
```
const opts = {
  firstTxId: FIRST_TX_ID, // (integer, optional), ex: 10
  txLimit: TX_LIMIT // maximum number of messages (integer, optional), ex: 10
}
xfg.messages(opts) // opts can be omitted
```
#### <a name="payments">Get incoming payments (Fuegowallet)
```
const paymentId = PAYMENT_ID // (64-digit hex string, required), ex: '0ab1...3f4b'
xfg.payments(paymentId)
```
#### <a name="transfers">Get transfers (Fuegowallet)
```
xfg.transfers() // gets all transfers
```
#### <a name="outputs">Get number of unlocked outputs (Fuegowallet)
```
xfg.outputs() // gets outputs available as inputs for a new transaction
```
#### <a name="reset">Reset wallet (Fuegowallet)
```
xfg.reset() // discard wallet cache and resync with block chain
```
#### <a name="store">Store wallet (Fuegowallet)
```
xfg.store() // save wallet cache to disk
```
#### <a name="optimize">Optimize wallet (Fuegowallet)
```
xfg.optimize() // combines many available outputs into a few by sending to self
```
#### <a name="send">Send transfers (Fuegowallet)
```
const transfers = [{ address: ADDRESS, amount: AMOUNT, message: MESSAGE }, ...] // ADDRESS = destination address (string, required), AMOUNT = raw XFG (integer, required), MESSAGE = transfer message to be encrypted (string, optional)
const opts = {
  transfers: transfers, // (array, required), ex: [{ address: 'fireCd9...', amount: 1000, message: 'refund' }]
  fee: FEE, // (raw XFG integer, optional, default is minimum required), ex: 10
  anonimity: MIX_IN, // input mix count (integer, optional, default 2), ex: 6
  paymentId: PAYMENT_ID, // (64-digit hex string, optional), ex: '0ab1...3f4b'
  unlockHeight: UNLOCK_HEIGHT // block height to unlock payment (integer, optional), ex: 12750
}
xfg.send(opts)
```
#### <a name="resetOrReplace">Reset or replace wallet (walletd)
```
const viewSecretKey = VIEW_SECRET_KEY // (64-digit hex string, optional), ex: '0ab1...3f4b'
xfg.resetOrReplace(viewSecretKey) // If no key, wallet is re-synced. If key, a new address is created from the key for a new wallet.
```
#### <a name="status">Get status (walletd)
```
xfg.status()
```
#### <a name="getBalance">Get balance (walletd)
```
const address = ADDRESS // (string, required), ex: 'fireCd9...'
xfg.getBalance(address)
```
#### <a name="createAddress">Create address (walletd)
```
xfg.createAddress()
```
#### <a name="deleteAddress">Delete address (walletd)
```
const address = ADDRESS // (string, required), ex: 'fireCd9...'
xfg.deleteAddress(address)
```
#### <a name="getAddresses">Get addresses (walletd)
```
xfg.getAddresses()
```
#### <a name="getViewSecretKey">Get view secret key (walletd)
```
xfg.getViewSecretKey()
```
#### <a name="getSpendKeys">Get spend keys (walletd)
```
const address = ADDRESS // (string, required), ex: 'fireCd9...'
xfg.getSpendKeys(address)
```
#### <a name="getBlockHashes">Get block hashes (walletd)
```
const firstBlockIndex = FIRST_BLOCK_INDEX // index of first block (integer, required), ex: 12750
const blockCount = BLOCK_COUNT // number of blocks to include (integer, required), ex: 30
xfg.getBlockHashes(firstBlockIndex, blockCount)
```
#### <a name="getTransaction">Get transaction (walletd)
```
const hash = HASH // (64-digit hex string, required), ex: '0ab1...3f4b'
xfg.getTransaction(hash) // get transaction details given hash
```
#### <a name="getUnconfirmedTransactions">Get unconfirmed transactions (walletd)
```
const addresses = [ADDRESS1, ADDRESS2, ...] // ADDRESS = address string; address to include
xfg.getUnconfirmedTransactions(addresses) // addresses can be omitted
```
#### <a name="getTransactionHashes">Get transactionHashes (walletd)
```
const opts = { // either blockHash or firstBlockIndex is required
  blockHash: BLOCK_HASH, // hash of first block (64-digit hex string, see comment above), ex: '0ab1...3f4b'
  firstBlockIndex: FIRST_BLOCK_INDEX, // index of first block (integer, see comment above), ex: 12750
  blockCount: BLOCK_COUNT, // number of blocks to include (integer, required), ex: 30
  addresses: [ADDRESS, ...], filter (array of address strings, optional), ex: ['fireCd9...']
  paymentId: PAYMENT_ID // filter (64-digit hex string, optional), ex: '0ab1...3f4b'
}
xfg.getTransactionHashes(opts)
```
#### <a name="getTransactions">Get transactions (walletd)
```
const opts = { // either blockHash or firstBlockIndex is required
  blockHash: BLOCK_HASH, // hash of first block (64-digit hex string, see comment above), ex: '0ab1...3f4b'
  firstBlockIndex: FIRST_BLOCK_INDEX, // index of first block (integer, see comment above), ex: 12750
  blockCount: BLOCK_COUNT, // number of blocks to include (integer, required), ex: 30
  addresses: [ADDRESS, ...], filter (array of address strings, optional), ex: ['fireCd9...']
  paymentId: PAYMENT_ID // filter (64-digit hex string, optional), ex: '0ab1...3f4b'
}
xfg.getTransactions(opts)
```
#### <a name="sendTransaction">Send transaction (walletd)
```
const transfers = [{ address: ADDRESS, amount: AMOUNT, message: MESSAGE }, ...] // ADDRESS = destination address (string, required), AMOUNT = raw XFG (integer, required), MESSAGE = transfer message to be encrypted (string, optional)
const addresses = [ADDRESS1, ADDRESS2, ...] // ADDRESS = source address string; address in wallet to take funds from
const opts = {
  transfers: transfers, // (array, required), ex: [{ address: 'fireCd9...', amount: 1000, message: 'tip' }]
  addresses: addresses, // (array, optional), ex: ['fireCd9...', 'xfg7Xe...']
  changeAddress: ADDRESS, // change return address (address string, optional if only one address in wallet or only one source address given), ex: 'fireCd9...'
  paymentId: PAYMENT_ID, // filter (64-digit hex string, optional), ex: '0ab1...3f4b'
  anonimity: MIX_IN, // input mix count (integer, optional, default 2), ex: 6
  fee: FEE, // (raw XFG integer, optional, default is minimum required), ex: 10
  unlockHeight: UNLOCK_HEIGHT, // block height to unlock payment (integer, optional), ex: 12750
  extra: EXTRA // (variable length string, optional), ex: '123abc'
}
xfg.sendTransaction(opts)
```
#### <a name="createDelayedTransaction">Create delayed transaction (walletd)
```
const transfers = [{ address: ADDRESS, amount: AMOUNT, message: MESSAGE }, ...] // ADDRESS = destination address (string, required), AMOUNT = raw XFG (integer, required), MESSAGE = transfer message to be encrypted (string, optional)
const addresses = [ADDRESS1, ADDRESS2, ...] // ADDRESS = source address string; address in wallet to take funds from
const opts = {
  transfers: transfers, // (array, required), ex: [{ address: 'fireCd9...', amount: 1000, message: 'tip' }]
  addresses: addresses, // (array, optional), ex: ['fireCd9...', 'xfg7Xe...']
  changeAddress: ADDRESS, // change return address (address string, optional if only one address in wallet or only one source address given), ex: 'fireCd9...'
  paymentId: PAYMENT_ID, // filter (64-digit hex string, optional), ex: '0ab1...3f4b'
  anonimity: MIX_IN, // input mix count (integer, optional, default 2), ex: 6
  fee: FEE, // (raw XFG integer, optional, default is minimum required), ex: 10
  unlockHeight: UNLOCK_HEIGHT, // block height to unlock payment (integer, optional), ex: 12750
  extra: EXTRA // (variable length string, optional), ex: '123abc'
}
xfg.createDelayedTransaction(opts) // create but do not send transaction
```
#### <a name="getDelayedTransactionHashes">Get delayed transaction hashes (walletd)
```
xfg.getDelayedTransactionHashes()
```
#### <a name="deleteDelayedTransaction">Delete delayed transaction (walletd)
```
const hash = HASH // (64-digit hex string, required), ex: '0ab1...3f4b'
xfg.deleteDelayedTransaction(hash)
```
#### <a name="sendDelayedTransaction">Send delayed transaction (walletd)
```
const hash = HASH // (64-digit hex string, required), ex: '0ab1...3f4b'
xfg.sendDelayedTransaction(hash)
```
#### <a name="getMessagesFromExtra">Get incoming messages from transaction extra field (walletd)
```
const extra = EXTRA // (hex string, required), ex: '0199...c3ca'
xfg.getMessagesFromExtra(extra)
```
### <a name="daemon">Daemon RPC (must provide daemonRpcPort)

#### <a name="info">Get info
```
xfg.info() // get information about the block chain, including next block height
```
#### <a name="index">Get index
```
xfg.index() // get next block height
```
#### <a name="count">Get count
```
xfg.count() // get next block height
```
#### <a name="currencyId">Get currency ID
```
xfg.currencyId()
```
#### <a name="blockHashByHeight">Get block hash by height
```
const height = HEIGHT // (integer, required), ex: 12750
xfg.blockHashByHeight(height) // get block hash given height
```
#### <a name="blockHeaderByHeight">Get block header by height
```
const height = HEIGHT // (integer, required), ex: 12750
xfg.blockHeaderByHeight(height) // get block header given height
```
#### <a name="blockHeaderByHash">Get block header by hash
```
const hash = HASH // (64-digit hex string, required), ex: '0ab1...3f4b'
xfg.blockHeaderByHash(hash) // get block header given hash
```
#### <a name="lastBlockHeader">Get last block header
```
xfg.lastBlockHeader()
```
#### <a name="block">Get block
```
const hash = HASH // (64-digit hex string, required), ex: '0ab1...3f4b'
xfg.block(hash)
```
#### <a name="blocks">Get blocks
```
const height = HEIGHT // (integer, required), ex: 12750
xfg.blocks(height) // returns 31 blocks up to and including HEIGHT
```
#### <a name="blockTemplate">Get block template
```
const address = ADDRESS // destination address (string, required), ex: 'fireCd9...'
const reserveSize = RESERVE_SIZE // bytes to reserve in block for work, etc. (integer < 256, optional, default 14), ex: 255
const opts = {
  address: address,
  reserveSize: reserveSize
}
xfg.blockTemplate(opts)
```
#### <a name="submitBlock">Submit block
```
const block = BLOCK // block blob (hex string, required), ex: '0300cb9eb...'
xfg.submitBlock(block)
```
#### <a name="transaction">Get transaction
```
const hash = HASH // (64-digit hex string, required), ex: '0ab1...3f4b'
xfg.transaction(hash)
```
#### <a name="transactions">Get transactions
```
const arr = [HASH1, HASH2, ...] // (array of 64-digit hex strings, required), ex: ['0ab1...3f4b']
xfg.transactions(arr)
```
#### <a name="transactionPool">Get transaction pool
```
xfg.transactionPool()
```
#### <a name="sendRawTransaction">Send raw transaction
```
const transaction = TRANSACTION // transaction blob (hex string, required), ex: ''01d86301...'
xfg.sendRawTransaction(transaction)
```
