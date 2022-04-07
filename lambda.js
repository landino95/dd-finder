const handler = require('serverless-express/handler');

const app = require('./index');
// const server = awsServerlessExpress.createServer(app);

// exports.express = (event, context) => {
    // awsServerlessExpress.proxy(server, event, context);
// }
module.exports.handler = handler(app)