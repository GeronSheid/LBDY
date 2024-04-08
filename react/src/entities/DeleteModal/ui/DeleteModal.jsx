import useFetching from "shared/hooks/useFetching";
import TaskManagementApi from "shared/api/TaskManagmentApi";
import Spiner from "../../../shared/assets/img/spinner.svg"
import UserApi from "shared/api/UserApi";
import { useNavigate } from "react-router-dom";
import { AUTH_ROUTE } from "shared/consts/paths";


const DeleteModal = ({
    type,
    name,
    id,
    closeFunc,
    setDeleteModalOpen,
    setOpasity,
    deleteRef,
    refetch,
    isMobile = false
}) => {

    const navigate = useNavigate()

    const [deleteDeadline, isLoadingDeadline] = useFetching(async () => {
        return await TaskManagementApi.deleteDeadline(id)
    })

    const [deleteHomework, isLoadingHomework] = useFetching(async () => {
        return await TaskManagementApi.deleteHomework(id)
    })
    const [deleteProject, isLoadingProject] = useFetching(async () => {
        return await TaskManagementApi.deleteProject(id)
    })
    const [deleteMe, isMeDeleting] = useFetching(async () => {
        return await UserApi.deleteMe()
    })
    const [deleteReminder, isLoadingReminder] = useFetching(async () => {
        return await TaskManagementApi.deleteReminder(id)
    })

    const deleteDeadlineFunc = (e) => {
        e.preventDefault()
        deleteDeadline()
            .then(res => {
                if (res.errors || !res) return
                setDeleteModalOpen(false)
                setOpasity(false)
            })
    }

    const deleteHomeworkFunc = (e) => {
        e.preventDefault()
        deleteHomework()
            .then(res => {
                if (res.errors || !res) return
                setDeleteModalOpen(false)
                setOpasity(false)
            })
    }
    const deleteProjectFunc = (e) => {
        e.preventDefault()
        deleteProject()
            .then(res => {
                if (res.errors || !res) return
                setDeleteModalOpen(false)
                setOpasity(false)
            })
    }
    const deleteMeFunc = (e) => {
        e.preventDefault()
        deleteMe()
            .then(res => {
                localStorage.clear()
                navigate(AUTH_ROUTE)
            })
    }
    const deleteReminderFunc = (e) => {
        e.preventDefault()
        deleteReminder()
            .then(res => {
                refetch()
                setDeleteModalOpen(false)
                setOpasity(false)
            })
    }

    return (
        <div ref={deleteRef} className={`${isMobile ? 'modalWindow_delete' : 'modalWindow'} ${type === "аккаунт" ? "deleteMe" : ""}`} >
            <div className="modalWindow__content">
                <h2 className="modalWindow__title">{type === 'аккаунт' ? "Удалить мой профиль?" : `Удалить ${type}${name ? `«${name}» ` : ""}?`}</h2>
                <p className="modalWindow__text">{type === 'аккаунт' ? "Придётся заново создавать профиль, ты точно этого хочешь?" : "Восстановить содержимое уже не получится"}</p>
                <div className="modalWindow__btn-wrap">
                    <>
                        {type === 'домашнее задание' &&
                            <button
                                className="btn-shape__filled btn-shape__filled_delete"
                                type="submit"
                                onClick={(e) => deleteHomeworkFunc(e)}
                            >
                                {isLoadingHomework ? <Spiner /> : 'Удалить'}
                            </button>
                        }
                        {type === 'дедлайн' &&
                            <button
                                className="btn-shape__filled btn-shape__filled_delete"
                                type="submit"
                                onClick={(e) => deleteDeadlineFunc(e)}
                            >
                                {isLoadingDeadline ? <Spiner /> : 'Удалить'}
                            </button>
                        }
                        {type === 'проект' &&
                            <button
                                className="btn-shape__filled btn-shape__filled_delete"
                                type="submit"
                                onClick={(e) => deleteProjectFunc(e)}
                            >
                                {isLoadingProject ? <Spiner /> : 'Удалить'}
                            </button>
                        }
                        {type === 'аккаунт' &&
                            <button
                                className="btn-shape__filled btn-shape__filled_delete"
                                type="submit"
                                onClick={(e) => deleteMeFunc(e)}
                            >
                                {isMeDeleting ? <Spiner /> : 'Удалить'}
                            </button>
                        }
                        {type === 'напоминание' &&
                            <button
                                className="btn-shape__filled btn-shape__filled_delete"
                                type="submit"
                                onClick={(e) => deleteReminderFunc(e)}
                            >
                                {isLoadingReminder ? <Spiner /> : 'Удалить'}
                            </button>
                        }
                    </>
                    <button
                        className="btn-shape__empty"
                        id="closeModalDeleteItem"
                        type="button"
                        onClick={() => { setDeleteModalOpen(false), setOpasity(false) }}
                    >
                        Закрыть
                    </button>
                </div>
            </div>



        </div>
    );
};

export default DeleteModal;
