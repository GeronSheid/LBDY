import React from 'react'

const UnsubscribeModal = ({ close, handleUnsubscribe, isMobile = true, isMarginBottom = false }) => {
  return (
    <div className={isMobile ? "modalWindow_delete" : "modalWindow"} >
      <div className="modalWindow__content">
        <h2 className="modalWindow__title" >Отменить подписку?</h2>
        <p className="modalWindow__text" >Платформа будет доступна до конца оплаченного периода</p>
        <div className="modalWindow__btn-wrap" style={isMarginBottom ? { marginBottom: 75 } : {}}>
          <button className="btn-shape__filled btn-shape__filled_delete" onClick={handleUnsubscribe}>Отменить подписку</button>
          <button onClick={close} className="btn-shape__empty">Назад</button>
        </div>
      </div>
    </div>
  )
}

export default UnsubscribeModal
