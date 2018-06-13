const isDev = process.env.NODE_ENV === 'development'

// -------------------- server -----------------------

const fs   = require('fs')
const koa  = new (require('koa'))()
const host = '0.0.0.0'
const port = isDev? 3111: 3110

koa.use(ctx=>{
  ctx.response.type = "text/html"
  ctx.response.body = fs.readFileSync(__dirname + '/index.html')
})

// ---------------------- web3 -----------------------

const Web3 = require('web3')
// const web3 = new Web3(new Web3.providers.HttpProvider("https://jsonrpc.medishares.net"))
// const web3 = new Web3(new Web3.providers.HttpProvider("http://47.75.185.67:8545"))
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
const eth  = web3.eth

// -------------------- contaract --------------------

const contractOpt = require('./contract/')
const contract    = eth.contract(contractOpt.abi).at(contractOpt.address)
contract.allEvents({
  // _userAddress: '',
  fromBlock : eth.blockNumber-(60*24*15) * 100
},(err,res)=>{
  console.log( res.event )
  io.socket.emit('newRecord', recordData.push(res))
})

// --------------------- socket ----------------------

const io       = new (require('koa-socket'))()
let recordData = []
io.on('connection', ctx=>{
  ctx.socket.emit('initRecord', recordData)
})
io.attach( koa )












// console.log( socket.socket.emit )








// ---------------------- 启动 ----------------------

koa.listen(port, host, ()=>{
  console.log(`server running in ${port}`)
})
