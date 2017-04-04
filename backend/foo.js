const upload = require('./app/index').upload;

function processFiles(filePath, skipsFilePath, urlPath) {
  upload(filePath, skipsFilePath, urlPath, process, () => {
    console.log('hey porkchop');
    process.send({ message: 'uploadedSuccessfully', args: [filePath, skipsFilePath, urlPath] });
  });
}

const [filePath, skipFile, url] = process.argv.slice(process.argv.length - 3, process.argv.length);
processFiles(filePath, skipFile, url);