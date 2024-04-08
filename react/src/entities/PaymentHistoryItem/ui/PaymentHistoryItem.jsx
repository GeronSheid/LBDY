import './PaymentHistoryItem.scss'


export const PaymentHistoryItem = ({item}) => {

  
  return (
    <div className='paymentHistoryItem'>
        <div className="paymentHistoryItem__price">{item.price} ₽</div>
        <div className="paymentHistoryItem__type">{item.type}</div>
        <div className="paymentHistoryItem__date">{item.date}</div>
        <div className="paymentHistoryItem__url">{item.url}</div>
    </div>
  )
}
