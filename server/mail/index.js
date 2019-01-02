import config from '../config/environment';
import SibApiV3Sdk from 'sib-api-v3-sdk';

/*
  Sample message input:
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
    // SendInBlue authentication
    let defaultClient = SibApiV3Sdk.ApiClient.instance;
    let authentications = defaultClient.authentications['api-key'];
    authentications.apiKey = config.mail.apiKey;

    // Compose email (no constructor available in v3)
    let messageToSend = new SibApiV3Sdk.SendSmtpEmail();
    messageToSend = { ...message };
    console.log('*** MESSAGE *** ', messageToSend);
    try {
      let apiInstance = new SibApiV3Sdk.SMTPApi();
      const data = await apiInstance.sendTransacEmail(messageToSend);
      return await data;
    } catch(err) {
      console.error(err);
    }
  }
};
