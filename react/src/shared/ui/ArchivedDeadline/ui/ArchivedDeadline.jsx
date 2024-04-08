import { useState } from "react";
import TaskManagementApi from "shared/api/TaskManagmentApi";
import useFetching from "shared/hooks/useFetching";
import { DeleteModal } from "entities/DeleteModal";

const ArchivedDeadline = ({ name, date, id, setUpdated, setOpasity }) => {
    const dateArchived = new Date(date)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [recoverDeadline] = useFetching(async () => {
        return await TaskManagementApi.updateDeadline(id, name, date, "active")
    })

    const setDeleteInfoFunc = (e) => {
        e.preventDefault()
        setDeleteModalOpen(true)
    }

    const setRecoverInfoFunc = async (e) => {
        e.preventDefault()
        await recoverDeadline()
        setUpdated()
    }

    return (
        <>
            <div className="reminders-item">
                <div className="reminders-item__info">
                    <span className="reminders-item__title">{name}</span>
                    <span className="reminders-item__descr">
                        {dateArchived.toLocaleDateString('ru-RU', {
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
                            <button
                                className="btn-text__service-gray btn-text__service-gray_delete"
                                type="submit"
                                onClick={(e) => { setDeleteInfoFunc(e), setOpasity(true) }}
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {deleteModalOpen &&
                <DeleteModal
                    type='дедлайн'
                    id={id}
                    name={name}
                    setOpasity={setOpasity}
                    setDeleteModalOpen={() => { setDeleteModalOpen(false), setUpdated() }}
                />}
        </>
    );
};

export default ArchivedDeadline;
