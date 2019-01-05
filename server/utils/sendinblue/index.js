import https from 'https';
import config from '../../config/environment';

// POST or PUT submission to SendInBlue
const sibSubmit = (method, path, content) => new Promise((resolve, reject) => {
  const data = JSON.stringify(content);
  const options = {
    hostname: 'api.sendinblue.com',
    path,
    method,
    headers: {
      'api-key': config.mail.apiKey,
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };
  const req = https.request(options, res => {
    res.on('data', buffer => {
      if(res.statusCode === 201) return resolve(buffer.toString('utf8'));
      reject(`Unexpected response (${res.statusCode}) from SendInBlue`);
    });
    req.on('error', err => {
      console.error('Error communicating with SendInBlue', err);
      reject('Error communicating with SendInBlue');
    });
  });
  req.write(data);
  req.end();
});

/*
  Sample contactInfo format
  {
    updateEnabled: true,
    email: 'foo@example.com',
    emailBlacklisted: false
    attributes: {
      NAME: 'First',
      SURNAME: 'Last',
    }
  }
*/
export const sibContactUpsert = contactInfo => sibSubmit('POST', '/v3/contacts', contactInfo);

export const sibOptOut = email => sibSubmit('PUT', `/v3/contacts/${email}`, { emailBlacklisted: true });

/*
  Sample message format
  {
    sender: [{ email: 'foo@example.com', name: 'Something' }], //sender: config.mail.sender,
    to: [{ email: 'foo@example.com', name: 'Something' }],
    subject: 'My Subject',
    htmlContent: 'This is test content',
    tags: ['myTag1', 'myTag2']
  }
*/
export const sibSendTransactionalEmail = message => sibSubmit('POST', '/v3/smtp/email', message);
