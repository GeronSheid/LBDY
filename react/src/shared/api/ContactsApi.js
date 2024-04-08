import newBaseUrl from 'shared/config/baseUrlConfig';
import LbdyNetwork from "shared/config/httpConfig";

const microService = 'tg-bot';

export default class ContactsApi {
  static async sendFeedback(feedbackText, queryType, subject) {
    return await LbdyNetwork.post({
      url: `feedback/?_type=${queryType}`, body: {
        body: feedbackText,
        subject: subject,
      }, microService,
      newBaseUrl: newBaseUrl.ContactsApi
    })
  }
  static async changeGroup(oldGroup, newGroup, reason) {
    return await LbdyNetwork.post({ url: `users/change-group/?old_group_id=${oldGroup}&new_group_id=${newGroup}&reason=${reason}`, microService, newBaseUrl: newBaseUrl.ContactsApi })
  }
};