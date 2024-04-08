import { useEffect, useState } from "react";
import TaskManagementApi from "shared/api/TaskManagmentApi";
import useFetching from "shared/hooks/useFetching";
import { DeleteModal } from "entities/DeleteModal";

export const ArchivedHomework = ({
  name,
  lessonId,
  id,
  setUpdated,
  setOpasity,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [homeworkDate, setHomeworkDate] = useState()
  const [recoverHomework] = useFetching(async () => {
    return await TaskManagementApi.updateHomeworkStatus(id, 'active');
  });
  const [getHomeworksData] = useFetching(async (id) => {
    return await TaskManagementApi.getHomeworkData(id)
})

useEffect(() => {
  getHomeworksData(lessonId)
    .then(res => {
      setHomeworkDate(res.data.date)
    })
}, [])

  const setDeleteInfoFunc = (e) => {
    e.preventDefault()
    setDeleteModalOpen(true)
  }

  const setRecoverInfoFunc = async (e) => {
    e.preventDefault()
    await recoverHomework()
    setUpdated()
  }
  return (
    <div className="reminders-item">
            <div className="reminders-item__info">
                <span className="reminders-item__title">{name}</span>
                <span className="reminders-item__descr">
          {new Date(homeworkDate).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}
                </span>
                <div className="field-wrapper">
                    <div className="field">
                        <button
                            className="btn-text__service-gray btn-text__service-gray_restore"
                            type="submit"
                            onClick={setRecoverInfoFunc}
                        >
                            Восстановить
                        </button>
                    </div>
                </div>
            </div>
            {deleteModalOpen && 
            <DeleteModal 
                type='домашнее задание'
                id={id}
                name={name}
                setOpasity={setOpasity}
                setDeleteModalOpen={() => {setDeleteModalOpen(false), setUpdated()}} />}
        </div>
  );
};
