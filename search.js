const StaticFileHandler = require('serverless-aws-static-file-handler');
const path = require('path');

const clientFilesPath = path.join(__dirname, './html');
const fileHandler = new StaticFileHandler(clientFilesPath);

module.exports.html = async (event, context, callback) => {
    event.path = './search.html'; 
    return fileHandler.get(event, context);
}