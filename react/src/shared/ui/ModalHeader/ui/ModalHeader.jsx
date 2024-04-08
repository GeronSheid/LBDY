
export const ModalHeader = ({showModal, title, icon}) => {
  return (
    <div className='modalWindow__header'>
        <div className="modalWindow__title-wrap">
          <legend className='modalWindow__legend'>{title}</legend>
          {icon}
        </div>
        <button 
          className='modalWindow__text-btn'
          onClick={() => showModal(false)}
        >
          Закрыть
        </button>
      </div>
  )
}
