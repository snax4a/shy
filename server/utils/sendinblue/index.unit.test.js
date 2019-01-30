/* globals describe, jest, test, beforeAll, expect */
import * as sib from '../sendinblue';

let sibMock;

describe('SendInBlue Util', () => {
  beforeAll(done => {
    sibMock = jest.spyOn(sib, 'sibSubmit');
    sibMock.mockImplementation(() => 'Calling sibSubmit()');
    done();
  });

  test('should invoke sibSubmit() with email parameters', async() => {
    const testMessage = {
      sender: [{ email: 'foo@example.com', name: 'Something' }],
      to: [{ email: 'foo@example.com', name: 'Something' }],
      subject: 'My Subject',
      htmlContent: 'This is test content',
      tags: ['myTag1', 'myTag2']
    };
    await sib.sibSendTransactionalEmail(testMessage);
    const method = 'POST';
    const url = '/v3/smtp/email';
    expect(sibMock).toHaveBeenCalledWith(method, url, testMessage);
  });

  test('should invoke sibSubmit() with opt out parameters', async() => {
    const email = 'nul@bitbucket.com';
    await sib.sibOptOut(email);
    const method = 'PUT';
    const url = `/v3/contacts/${email}`;
    const data = { emailBlacklisted: true };
    expect(sibMock).toHaveBeenCalledWith(method, url, data);
  });

  test('should invoke sibSubmit() with contact upsert parameters', async() => {
    const contactInfo = {
      updateEnabled: true,
      email: 'foo@example.com',
      emailBlacklisted: false,
      attributes: {
        NAME: 'First',
        SURNAME: 'Last'
      }
    };
    await sib.sibContactUpsert(contactInfo);
    const method = 'POST';
    const url = '/v3/contacts';
    expect(sibMock).toHaveBeenCalledWith(method, url, contactInfo);
  });
});
