const express = require('serverless-express/express');
const api = require('./api');

const app = express();
// app.use(awsServerlessExpressMiddleware.eventContext());
// app.use(express.json());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('x-powered-by', 'serverless-express')
  next()
})

// app.get('/', (req, res) => {
//     res.json(req.apiGateway.event);
// })

app.get('/test', api.test)
// app.use((err, req, res, next) => {
//     if(!res.headersSent){
//         res.setHeader('Content-Type', 'text-plain');
//         res.status(500);
//     }
// })

const port = 3000;
module.exports = app;
app.listen(port, () => console.log('Running Express'));