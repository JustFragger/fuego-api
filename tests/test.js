const XFG = require('..')
const XFG = new XFG({
  daemonHost: 'http://localhost', 
  walletHost: 'http://localhost', 
  daemonRpcPort: 18180,
  walletRpcPort: 8070,
  rpcUser: 'rpcuser',
  rpcPassword: 'rpcpass'
})

xfg.status()
.then((res) => { console.log(res) }) // display tx hash upon success
.catch((err) => { console.log(err) }) // display error message upon failure
