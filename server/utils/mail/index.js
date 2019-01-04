import https from 'https';
import config from '../../config/environment';

/*
  Sample message input format:
  {
    sender: [{ email: 'foo@example.com', name: 'Something' }], //sender: config.mail.sender,
    to: [{ email: 'foo@example.com', name: 'Something' }],
    subject: 'My Subject',
    htmlContent: 'This is test content',
    tags: ['myTag1', 'myTag2']
  }
*/

const sendTransactionalEmail = message => new Promise((resolve, reject) => {
  const data = JSON.stringify(message);
  const options = {
    hostname: 'api.sendinblue.com',
    path: '/v3/smtp/email',
    method: 'POST',
    headers: {
      'api-key': config.mail.apiKey,
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };
  const req = https.request(options, res => {
    res.on('data', buffer => {
      if(res.statusCode === 201) return resolve(buffer.toString('utf8'));
      reject('Unexpected response from SendInBlue');
    });
    req.on('error', err => {
      console.error('Error communicating with SendInBlue', err);
      reject('Error communicating with SendInBlue');
    });
  });
  req.write(data);
  req.end();
});

export default {
  send: async message => {
    try {
      return await sendTransactionalEmail(message);
    } catch(err) {
      console.error(err);
      return 'Did not send the email.';
    }
  }
};
