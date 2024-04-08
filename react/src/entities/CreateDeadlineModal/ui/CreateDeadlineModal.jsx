import "pages/MainPage/ui/sass/main.scss"
import { useCallback, useLayoutEffect, useState } from "react";
import { gsap } from "gsap";
import { Input } from "shared/ui/Input";
import { RemindForm } from "shared/ui/RemindForm";
import useFetching from "shared/hooks/useFetching";
import TaskManagementApi from "shared/api/TaskManagmentApi";
import Spiner from "../../../shared/assets/img/spinner.svg"
import { Switcher } from "shared/ui/Switcher/ui/Switcher";
import { ModalHeader } from "shared/ui/ModalHeader/ui/ModalHeader";
import { ModalFooter } from "shared/ui/ModalFooter/ui/ModalFooter";



const CreateDeadlineModal = ({ deadline, setDeadline, setHide, setHasUpdated, isMobile = true  }) => {

    const [name, setName] = useState("")
    const [date, setDate] = useState("")
    const [newReminderTmp, setNewReminderTmp] = useState({
        days: [],
    })
    const [startValidation, setStartValidation] = useState(false)
    const [remindForm, setRemindForm] = useState(false)
    let expId
    const [createDeadline, isLoading] = useFetching(useCallback(async () => {
        return await TaskManagementApi.createDeadline(name, date, "active")
    }, [name, date]))
    const [createReminder, isPreLoading] = useFetching(useCallback(async () => {
        return await TaskManagementApi.createReminder({ ...newReminderTmp, entity_id: expId, min: newReminderTmp.min >= 15 ? 30 : 0 })
    }, [newReminderTmp]))


    useLayoutEffect(() => {
        if (deadline) {
            gsap.to(".modal-deadline", { opacity: 1, zIndex: 500, duration: 0.05 })
            setTimeout(() => setHide(false), 1)
        } else {
            gsap.to(".modal-deadline", { opacity: 0, zIndex: -10, duration: 0.05 })
            setTimeout(() => setHide(true), 1)
        }
    }, [deadline]);

    function handleCreateDeadline() {
        if (!name || !date) {
            setStartValidation(true)
        } else {
            createDeadline()
                .then(res => {
                    if (res.errors || !res) return
                    setDeadline(false)
                    setHasUpdated()
                })
        }

    }

    async function handleCreateReminder() {
        if (!name || !date || !newReminderTmp.days.length || !newReminderTmp.min || !newReminderTmp.hour || !newReminderTmp.text) {
            setStartValidation(true)
        }
        await createDeadline()
            .then((res) => {
                if (res.errors || !res) return
                expId = res.data._id

            })

        createReminder()
            .then(res => {
                if (res.errors || !res) return
                setDeadline(false)
                setHasUpdated()
            })

    }

    const createDeadlineFunc = async () => {
        if (!remindForm) {
            handleCreateDeadline()
        } else {
            handleCreateReminder()
        }
    }

    return (
        <div className="modalWindow">
            <ModalHeader
                showModal={() => setDeadline(false)}
                title='Дедлайн'
            />
            <div className="modalWindow__content">
                <Input
                    className={isMobile ? "input__simple-input_light" : "input__simple-input_dark"}
                    type="text"
                    name="name"
                    placeholder="Название"
                    value={name}
                    setValue={(e) => setName(e.target.value)}
                    validation={!name && startValidation}
                    validationText="Это поле должно быть заполнено"
                />
                <Input
                    type="date"
                    className={isMobile ? "input__simple-input_light" : "input__simple-input_dark"}
                    value={date}
                    setValue={(e) => { setDate(e) }}
                    placeholder="Дата"
                    validation={!date && startValidation}
                    validationText="Необходимо выбрать дату"
                />
                <ModalFooter
                    isMobile={isMobile}
                    submitFunction={() => createDeadlineFunc()}
                    setRemindForm={() => setRemindForm(!remindForm)}
                    remindForm={remindForm}
                    reminderSwitcher={true}
                    startValidation={startValidation}
                    newReminderTmp={newReminderTmp}
                    setNewReminderTmp={setNewReminderTmp}
                    date={date}
                    isDark={true}
                    type={'Дедлайн'}
                />
            </div>
            {/* <button
                className="btn-text__close-modal_light"
                id="closeModalDeadline"
                onClick={() => setDeadline(false)}
            >
                Закрыть
            </button>
            <form className="form">
                <legend className="legend">Дедлайн</legend>
                <fieldset className="form__fieldset">
                    <Input
                        className="input__simple-input_dark"
                        type="text"
                        name="name"
                        placeholder="Название"
                        value={name}
                        setValue={(e) => setName(e.target.value)}
                        validation={!name && startValidation}
                        validationText="Это поле должно быть заполнено"
                    />
                    <Input
                        type="date"
                        className="input__simple-input_dark"
                        value={date}
                        setValue={(e) => {setDate(e)}}
                        placeholder="Дата"
                        validation={!date && startValidation}
                        validationText="Необходимо выбрать дату"
                    />

                    <div className="field input__checkbox">
                        <Switcher
                            idVar={"remindToggleBtnDeadline"}
                            handleClick={() => setRemindForm(!remindForm)}
                            defChecked={remindForm}
                            isDark={true}
                        />
                    </div>
                    {remindForm && <RemindForm
                                        validation={startValidation}
                                        newReminderTmp={newReminderTmp}
                                        setNewReminderTmp={setNewReminderTmp}
                                        date={date}
                                        type='Дедлайн'
                                    />}
                    <button
                        className="btn-shape__filled"
                        id="addNewDeadline"
                        type="submit"
                        style={{marginTop: remindForm ? 16 : 20, zIndex: 1}}
                        onClick={(e) => createDeadlineFunc(e)}
                    >
                        {isLoading || isPreLoading ?  <Spiner className="loader"/> :  "Cоздать"}
                    </button>
                </fieldset>
            </form> */}
        </div>
    );
};

export default CreateDeadlineModal;
