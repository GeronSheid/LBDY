import { PaymentCard } from 'shared/ui/PaymentCard';
import './paymentTypesList.scss';
import useWindow from 'shared/hooks/useWindow';
import useFetching from 'shared/hooks/useFetching'
import PaymentApi from 'shared/api/PaymentApi';
import { useEffect, useState } from 'react';
import { ModalWrapper } from "shared/ui/ModalWrapper";
import {ChangeCardModal} from "entities/ChangeCardModal";
import {UnsubscribeModal} from "entities/UnsubscribeModal";
import {myId} from 'shared/consts/usefullValues'

export const PaymentTypesList = () => {

  const id = myId;

  const [card, setCard] = useState('')
  const [cardType, setCardType] = useState('')
  const [date, setDate] = useState('')
  const [days, setDays] = useState(3)
  const [link, setLink] = useState('')
  const [status, setStatus] = useState('')
  const [endless, setEndless] = useState(false)

  const [changeModal, setChangeModal] = useState(false)
  const [unsubscribeModal, setUnsubscribeModal] = useState(false)

  const [btnLabel, setBtnLabel] = useState('')


  const [refetchProfileStatus, setRefetchProfileStatus] = useState(false)
  const [startQuerry, setStartQuerry] = useState(false)
  

  const [fetchPaymentData] = useFetching(async () => {
    return await PaymentApi.getPaymentInfo();
  })

  const [activateSubscription] = useFetching(async () => {
    return await PaymentApi.activateSubscription(id);
  })

  const [unsubscribe] = useFetching(async () => {
    return await PaymentApi.unsubscribe();
  })

  useEffect(() => {
    fetchPaymentData()
      .then(res => {
        if(!res || res.errors) return
        setCard(res.data.card)
        setCardType(res.data.card !== null ? cardTypes[res.data.card.slice(0,1)] : '')
        setDate(res.data.exp)
        setStatus(res.data.status)
        setDays(res.data.days_to_expire)
        if(res.data.exp === null && res.data.status === 'active') setEndless(true)
    })
  }, [])

  useEffect(() => {
    setTimeout(() => {
      fetchPaymentData()
      .then(res => {
        if(!res || res.errors) return
        setCard(res.data.card)
        setCardType(res.data.card !== null ? cardTypes[res.data.card.slice(0,1)] : '')
        setDate(res.data.exp)
        setStatus(res.data.status)
        setDays(res.data.days_to_expire)
        if(res.data.exp === null && res.data.status === 'active') setEndless(true)
    })
    }, 500)
  }, [refetchProfileStatus])

  useEffect(() => {
    if(startQuerry === false) return
    activateSubscription()
      .then(res => {
        if(!res || res.errors) return
        setLink(res.data)
      })
  }, [startQuerry])

  useEffect(() => {
    if(link !== '' && link !== null) {
      window.location.replace(link)
    }
  }, [link])

  const changeModalFunc = () => {
    setChangeModal(true)
    setRefetchProfileStatus(!refetchProfileStatus)
  }

  const unsubscribeFunc = () => {
    unsubscribe()
    setUnsubscribeModal(false)
    setRefetchProfileStatus(!refetchProfileStatus)
  }

  const {windowWidth, windowHeight, orientation} = useWindow();
  const isMobile = windowWidth < 1025 || windowHeight <= 600;

  const cardTypes = {
    2: 'Mir',
    4: 'Visa',
    5: 'Mastercard'
  }

  const buttonVariants = (status) => {
    switch(status) {
      case 'active': 
        return {label: 'Отменить подписку', func: () => setUnsubscribeModal(true)}
      case 'trial': 
        return {label: 'Оформить подписку', func: () => changeModalFunc(), modalVariant: 1}
      case 'deactivate_requested':
        return {label: 'Возобновить подписку', func: () => changeModalFunc(), modalVariant: 2}
    }
  }

  const formatedDate = (days) => {
    switch(days) {
      case 1:
        return 'Завтра'
      case 0: 
        return 'Сегодня'
      default:
        return new Date(date).toLocaleDateString('ru-RU')
    }
  }
  useEffect(() => {
    setBtnLabel(buttonVariants(status)?.label)
  }, [status, refetchProfileStatus])

  const expirationDate = (date) => {
    if (date !== '' && date !== null) {
      return status === 'trial' ? `Дата окончания пробного периода: ${formatedDate(days)}` : status === 'deactivate_requested' ? `Дата окончания подписки: ${formatedDate(days)}` : `Дата следующего списания: ${formatedDate(days)}`
    } else {
      return 'Нету подписки'
    }
  }

  return (
    <>
      {changeModal &&
        <ModalWrapper>
          <ChangeCardModal close={
            () => setChangeModal(false)} 
            link={link} 
            setStartQuerry={setStartQuerry} 
            setRefetchProfileStatus={() => setRefetchProfileStatus(!refetchProfileStatus)} 
            variant={buttonVariants(status)?.modalVariant} 
            isMobile={isMobile}/>
        </ModalWrapper>
      }
      {unsubscribeModal &&
        <ModalWrapper>
          <UnsubscribeModal close={() => setUnsubscribeModal(false)} handleUnsubscribe={() => unsubscribeFunc()} isMarginBottom={isMobile} isMobile={isMobile} />
        </ModalWrapper>
      }
      {!endless ?
        <div className='paymentTypesList'>
            <legend className='legend legend_thin'>
              {expirationDate(date)}
            </legend>
          <PaymentCard number={card} cardType={cardType} showModal={() => changeModalFunc()} />
          <button className='btn-text__fork' onClick={buttonVariants(status)?.func}>
            {btnLabel}
          </button>
        </div>
        :
        <div className='emptyList__title'>
          Бессрочная подписка
        </div>
      }
    </>
  )
}
