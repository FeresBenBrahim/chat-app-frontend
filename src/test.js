const axios = require('axios');
const fs = require('fs');
const path = require('path');

const downloadFile = async () => {
  const fileUrl = 'https://www.africau.edu/images/default/sample.pdf'; // URL of the file to download
  const downloadDirectory = '/Users/takiacademy/testttt'; // The directory where you want to save the file

  try {
    const response = await axios.get(fileUrl, {
      responseType: 'stream',
    });

    const fileName = path.basename(fileUrl);
    const filePath = path.join(downloadDirectory, fileName);

    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (err) {
    console.error(`Error downloading file: ${err.message}`);
  }
};

downloadFile()
  .then(() => {
    console.log('File downloaded successfully');
  })
  .catch((error) => {
    console.error(`Error: ${error}`);
  });
