import axios from 'axios';
import config from '../../config/environment';

// POST or PUT submission to SendInBlue
async function sibSubmit(method, url, data) {
  let instance = axios.create({
    baseURL: 'https://api.sendinblue.com',
    headers: { 'api-key': config.mail.apiKey }
  });
  try {
    const response = await instance({
      method,
      url, // relative
      data
    });
    return response;
  } catch(err) {
    console.error('Error communicating with SendInBlue', instance, err);
    // Don't rethrow errors since we don't want to interrupt other operations
  }
}

/*
  Sample contactInfo format
  {
    updateEnabled: true,
    email: 'foo@example.com',
    emailBlacklisted: false
    attributes: {
      NAME: 'First',
      SURNAME: 'Last'
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
