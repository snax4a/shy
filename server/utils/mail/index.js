import { sibSendTransactionalEmail } from '../sendinblue';

export default {
  send: async message => {
    try {
      return await sibSendTransactionalEmail(message);
    } catch(err) {
      console.error(err);
      return 'Did not send the email.';
    }
  }
};
