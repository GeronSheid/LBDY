import newBaseUrl from "shared/config/baseUrlConfig";
import LbdyNetwork from "shared/config/httpConfig";

const subscription = 'payment';

export default class PaymentApi {
  static async getPaymentInfo() {
    return await LbdyNetwork.get({url: 'subscription/', microService: subscription, newBaseUrl: newBaseUrl.PaymentApi})
  }

  static async activateSubscription(id) {
    return await LbdyNetwork.post({url: `subscription/activate/?user_id=${id}`, microService: subscription, newBaseUrl: newBaseUrl.PaymentApi})
  }

  static async unsubscribe() {
    return await LbdyNetwork.postNoBody({url: 'subscription/deactivate/', microService: subscription, newBaseUrl: newBaseUrl.PaymentApi})
  }
}