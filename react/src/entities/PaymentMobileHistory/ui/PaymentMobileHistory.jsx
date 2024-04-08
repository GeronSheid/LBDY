import { useState } from 'react'
import './PaymentMobileHistory.scss'
import { PaymentHistoryItem } from 'entities/PaymentHistoryItem/ui/PaymentHistoryItem'


export const PaymentMobileHistory = ({elementRef, close}) => {

  const [history, setHistory] = useState([
    {
      price: 500,
      type: "Пробный план, месячно",
      date: "14.04.2023",
      url: "https://checki.ru/18992"
    },
    {
      price: 500,
      type: "Пробный план, месячно",
      date: "14.04.2023",
      url: "https://checki.ru/18992"
    },
  ])




  return (
    <div ref={elementRef} className='paymentMobileHistory'>
        <div>
          <button className='paymentMobileHistory__closeButton' onClick={close} ></button>
          <h2 className="paymentMobileHistory__title">История оплат</h2>
        </div>
        <div>
          {history.map(elem => (
            <PaymentHistoryItem item={elem}/>
          ))}
        </div>
        <button 
          className='paymentMobileHistory__removeButton'
          id="cancelSubscription"
          type="button">
            Отменить подписку
        </button>
    </div>
  )
}
