// /api/products.js
const request = require('request');
const cors = require('cors');

const handler = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const options = {
    method: 'POST',
    url: 'https://www.zohoapis.eu/crm/v2/functions/workdrive_api/actions/execute?auth_type=apikey&zapikey=1003.14fee42ccd3ee642d0724eb384a69cee.26a12889161bab18839ab997b0dd8443',
    headers: {
      'Cookie': '_zcsr_tmp=b58ca7d7-edf7-4e20-8d31-d5bd453bfc26; crmcsr=b58ca7d7-edf7-4e20-8d31-d5bd453bfc26; zalb_4993755637=c423e3302be0acbf448596eaddb26b48',
    },
  };

  request(options, function (error, response) {
    if (error) {
      console.error(error);
      res.status(500).send('Error fetching data from Zoho CRM');
      return;
    }

    try {
      const mainBody = JSON.parse(response.body);
      const outputString = mainBody.details.output;
      const outputData = JSON.parse(outputString);

      if (outputData.data && Array.isArray(outputData.data)) {
        const products = outputData.data.map(product => ({
          ProductID: product.ID,
          name: product.Product_Name,
          images: product.Product_Images.map(img => img.display_value),
        }));
        res.json(products);
      } else {
        console.error("Expected 'data' array not found in output:", outputData);
        res.status(500).send('Invalid data format from Zoho CRM');
      }
    } catch (parseError) {
      console.error("Failed to parse response body:", parseError);
      res.status(500).send('Error parsing data from Zoho CRM');
    }
  });
};

module.exports = handler;
