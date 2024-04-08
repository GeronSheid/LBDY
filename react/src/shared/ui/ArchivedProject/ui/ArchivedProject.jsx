import {useState} from "react";
import TaskManagementApi from "shared/api/TaskManagmentApi";
import useFetching from "shared/hooks/useFetching";
import { DeleteModal } from "entities/DeleteModal";

const ArchivedProject = ({name, date, id, setUpdated, setOpasity}) => {
    const dateArchived = new Date(date)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [recoverProject] = useFetching(async () => {
        return await TaskManagementApi.updateProject(id, "active")
    })

    const setDeleteInfoFunc = (e) => {
        e.preventDefault()
        setDeleteModalOpen(true)
    }

    const setRecoverInfoFunc = async (e) => {
        e.preventDefault()
        await recoverProject()
        setUpdated()
    }

    return (
        <div className="reminders-item">
            <div className="reminders-item__info">
                <span className="reminders-item__title">{name}</span>
                <span className="reminders-item__descr">
                    {dateArchived.toLocaleDateString("ru-RU")}
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
                            onClick={(e) => {setDeleteInfoFunc(e), setOpasity(true)}}
                        >
                            Удалить
                        </button>
                    </div>
                </div>
            </div>
            {deleteModalOpen && 
            <DeleteModal 
                type='проект'
                id={id}
                name={name}
                setOpasity={setOpasity}
                setDeleteModalOpen={() => {setDeleteModalOpen(false), setUpdated()}} />}
        </div>
    );
};

export default ArchivedProject;
