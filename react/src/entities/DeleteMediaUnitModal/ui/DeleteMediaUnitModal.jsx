export const DeleteMediaUnitModal = ({func, closeModal, isFile, id, isMobile = false }) => {

  return (
    <div className={isMobile ? 'modalWindow_delete' : 'modalWindow'}>
      <div className="modalWindow__content">
        <h2 className="modalWindow__title">{`Удалить ${isFile} из базы данных?` }</h2>
      </div>
      <div className="modalWindow__btn-wrap">
        <button 
          className="btn-shape__filled btn-shape__filled_delete"
          type='submit'
          onClick={() => func(id)}
        >
          Удалить
        </button>
        <button 
          className="btn-shape__empty"
          type='button'
          onClick={() => closeModal(false)}
        >
          Назад
        </button>
      </div>
    </div>
  )
}
