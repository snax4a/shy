/* globals describe, jest, test, expect */
import mail from './index';
import * as sib from '../sendinblue';

describe('EMAIL Util', () => {
  test('should call sibSubmit in server/utils/sendinblue/index.js', async() => {
    const sibMock = jest.spyOn(sib, 'sibSubmit');
    sibMock.mockImplementation(() => 'Calling sibSubmit()');
    const testMessage = {
      sender: [{ email: 'foo@example.com', name: 'Something' }],
      to: [{ email: 'foo@example.com', name: 'Something' }],
      subject: 'My Subject',
      htmlContent: 'This is test content',
      tags: ['myTag1', 'myTag2']
    };
    await mail.send(testMessage);
    const method = 'POST';
    const url = '/v3/smtp/email';
    expect(sibMock).toHaveBeenCalledWith(method, url, testMessage);
  });
});
