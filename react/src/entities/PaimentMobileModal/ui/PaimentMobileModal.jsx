import { PaymentTypesList } from 'widgets/PaymentTypesList'
import './PaimentMobileModal.scss'
import { PaymentTypes } from 'features/PaymentTypes'


export const PaimentMobileModal = ({elementRef, close}) => {

  
  return (
    <div ref={elementRef} className='paymentMobileModal'>
      <button className='paymentMobileModal__closeButton' onClick={close} ></button>
        <h2 className="paymentMobileModal__title">Оплата</h2>
        <PaymentTypesList/>
    </div>
  )
}
