import { sendTransactionalEmail } from '../sendinblue';

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
