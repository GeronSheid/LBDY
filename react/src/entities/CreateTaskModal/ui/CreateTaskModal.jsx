import "pages/MainPage/ui/sass/main.scss"
import "app/styles/modules/input/input.scss"
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { gsap } from "gsap"
import { RemindForm } from "shared/ui/RemindForm";
import "./CreateTaskModal.scss"
import useFetching from "shared/hooks/useFetching";
import TaskManagementApi from "shared/api/TaskManagmentApi";
import { Input } from "shared/ui/Input";
import { REQUIRED_FIELD } from "shared/consts/consts";
import { Select } from "widgets/Select";
import Spiner from "../../../shared/assets/img/spinner.svg"
import { Switcher } from "shared/ui/Switcher/ui/Switcher";
import { ModalHeader } from "shared/ui/ModalHeader/ui/ModalHeader";
import { ModalFooter } from "shared/ui/ModalFooter/ui/ModalFooter";


const CreateTaskModal = ({ method, task, refetch, myProjects, createModalOpen, setCreateModalOpen, setHide, projectId, users, isMobile }) => {
    const [remindForm, setRemindForm] = useState(false)
    const [type, setType] = useState(myProjects)
    const [name, setName] = useState(task ? task.name : "")
    const [description, setDescription] = useState(task ? task.description : "")
    const [options, setOptions] = useState(users.map(user => ({ label: `${user.first_name} ${user.last_name}`, value: { userId: user.id, src: user.avatars.small } })))
    const [date, setDate] = useState(task ? new Date(task.date) : "")
    const [startValidation, setStartValidation] = useState(false)
    const [newReminderTmp, setNewReminderTmp] = useState({
        days: [],
    })
    const [isPrevReminder, setIsPrevReminder] = useState()
    const [subject, setSubject] = useState(method === "POST" ? [] : options.filter(option => option.value.userId === task.executor_id))
    let expId
    const formatedDate = date ? `${date?.getFullYear()}-${(date?.getMonth() + 1).toString().length === 1 ? '0' + (date?.getMonth() + 1).toString() : (date?.getMonth() + 1).toString()}-${date?.getDate() .toString().length === 1 ? '0' + date?.getDate().toString() : date?.getDate().toString()}` : null;


    const [createReminder, isPreLoading] = useFetching(useCallback(async () => {
        return await TaskManagementApi.createReminder({
            ...newReminderTmp, entity_id: expId,
            hour: Number(newReminderTmp.hour), min: newReminderTmp.min >= 15 ? 30 : 0, type: "Задача по проекту"
        })
    }, [newReminderTmp]))

    const [createTask, isLoadingCreate] = useFetching(useCallback(async () => {
        return await TaskManagementApi.createProjectTask(name, description, projectId, formatedDate)
    }, [name, description, date, subject, projectId]))

    const [updateTask, isLoadingUpdate] = useFetching(useCallback(async () => {
        return await TaskManagementApi.updateProjectTask(task._id, { name: name, description: description, date: new Date(date).toLocaleDateString('en-CA'), done: false })
    }, [name, description, date, subject, projectId]))

    const [patchReminder, isPostLoading] = useFetching(useCallback(async () => {
        return await TaskManagementApi.patchReminder(newReminderTmp._id,
            {
                days: newReminderTmp.days, hour: newReminderTmp.hour, min: newReminderTmp.min >= 15 ? "30" : "00",
                text: newReminderTmp.text, exp_date: newReminderTmp.exp_date
            })
    }, [newReminderTmp]))

    const [fetchThisReminder, isLoadingThisReminder, isThisReminderAbsence] = useFetching(async () => {
        return await TaskManagementApi.getThisReminder(task._id)
    })

    const [deleteReminder, isDeletingReminder,] = useFetching(async () => {
        return await TaskManagementApi.deleteReminder(newReminderTmp._id)
    }, [])

    useEffect(() => {
        if (method === "POST") return
        const fetchReminder = async () => {
            let res = await fetchThisReminder()
            if (!res) return
            setIsPrevReminder(!res.errors)
            setRemindForm(!res.errors)
            if (res.errors) {
                setNewReminderTmp({
                    days: [],
                    text: "",
                    hour: "",
                    min: "",
                })
            } else {
                setNewReminderTmp(res.data)
                setRemindForm(true)
            }

        }
        fetchReminder()

    }, [])

    function handleCreateTask() {
        createTask()
            .then(res => {
                refetch()
                setCreateModalOpen(false)
                setHide()
            })
    }

    async function handleCreateTaskAndReminder() {
        await createTask()
            .then((res) => {
                if (res.errors || !res) return
                expId = res.data._id

            })
        createReminder()
            .then(res => {
                refetch()
                setCreateModalOpen(false)
                setHide()
            })
    }

    function handleSubmit() {
        if (method === "POST") createProjectFunc()
        else updateProjectFunc()
    }

    const createProjectFunc = () => {
        if (remindForm) {
            if (name === "" || description === "" || date === "" || !newReminderTmp.days.length || !newReminderTmp.min || !newReminderTmp.hour || !newReminderTmp.text) {
                setStartValidation(true)
            } else
                handleCreateTaskAndReminder()
        } else {
            if (name === "" || description === "" || date === "") {
                setStartValidation(true)
            } else
                handleCreateTask()
        }
    }

    const updateProjectFunc = async () => {
        if (!remindForm) {
            if (name === "" || description === "" || date === "") {
                setStartValidation(true)
            }
            else {
                await updateTask()
                    .then(res => {
                        refetch()
                        setCreateModalOpen(false)
                        setHide()
                    })
                if (isPrevReminder) {
                    deleteReminder()
                }
            }
        } else {
            if (name === "" || description === "" || date === "" || !newReminderTmp.days.length || !newReminderTmp.min || !newReminderTmp.hour || !newReminderTmp.text) {
                setStartValidation(true)
            } else
                if (isPrevReminder) {
                    updateTask()
                    patchReminder()
                        .then(res => {
                            refetch()
                            setCreateModalOpen(false)
                            setHide()
                        })
                } else {
                    updateTask()
                        .then(res => {
                            if (res.errors || !res) return
                            expId = res.data._id
                            createReminder()
                            refetch()
                            setCreateModalOpen(false)
                            setHide()
                        })
                }
        }
    }

    return (
        <div className="modalWindow">
            <ModalHeader
                showModal={() => { setHide(false); setCreateModalOpen(false); }}
                title={method === "POST" ? "Создание задачи" : "Редактирование задачи"}
            />
            <div className="modalWindow__content">
                <Input
                    className={isMobile ? "input__simple-input_light" : "input__simple-input_dark"}
                    type="text"
                    name="name"
                    placeholder="Название"
                    value={name}
                    setValue={(e) => setName(e.target.value)}
                    validation={startValidation && name === ""}
                    validationText={REQUIRED_FIELD}
                />
                <Input
                    className={isMobile ? "input__textarea_light" : "input__textarea_dark"}
                    type="textarea"
                    placeholder="Описание"
                    value={description}
                    setValue={(e) => setDescription(e.target.value)}
                    validation={startValidation && description === ""}
                    validationText={REQUIRED_FIELD}
                />
                <Input
                    className={isMobile ? "input__simple-input_light" : "input__simple-input_dark"}
                    placeholder="Дедлайн"
                    type="date"
                    value={date}
                    setValue={(e) => setDate(e)}
                    validation={startValidation && date === ""}
                    validationText={REQUIRED_FIELD}
                />
                <ModalFooter
                    isMobile={isMobile}
                    submitFunction={() => handleSubmit()}
                    setRemindForm={() => setRemindForm(!remindForm)}
                    remindForm={remindForm}
                    reminderSwitcher={true}
                    startValidation={startValidation}
                    newReminderTmp={newReminderTmp}
                    setNewReminderTmp={setNewReminderTmp}
                    date={date}
                    isDark={true}
                    type={'Задача по проекту'}
                />
            </div>
        </div>
    );
};

export default CreateTaskModal;
