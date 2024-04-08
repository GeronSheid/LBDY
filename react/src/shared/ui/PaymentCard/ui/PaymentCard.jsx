import React from 'react'
import { Checkbox } from 'shared/ui/Checkbox';
import './paymentCard.scss';
import Mastercard from  'shared/assets/img/Mastercard.svg';
import Visa from  'shared/assets/img/Visa.svg';
import Mir from  'shared/assets/img/Mir.svg';
import Plus from  'shared/assets/img/Plus.svg';

export const PaymentCard = ({number, cardType, showModal}) => {

  const cardTypes = {
    Mastercard: <Mastercard width={80} height={34} className='paymentCard__cardLogo'/>,
    Visa: <Visa width={80} height={34} className='paymentCard__cardLogo'/>,
    Mir: <Mir width={80} height={34} className='paymentCard__cardLogo'/>,
  }

  return (
    <div className='paymentCard'>
      {number === '' || number === null 
        ?
        <p className='paymentCard__noCard'>
            Карта не привязана
        </p>
        :
        <>
            <p className='paymentCard__number'>
                {number}
            </p>
            {cardTypes[cardType]}
            <button 
              className='btn-text__service-gray paymentCard__delete'
              onClick={showModal}
            >
              Изменить карту
            </button>
        </>
      }

      
    </div>
  )
}
