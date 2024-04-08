import "pages/MainPage/ui/sass/main.scss"
import {useCallback, useLayoutEffect, useState, useEffect} from "react";
import {gsap} from "gsap";
import {RemindForm} from "shared/ui/RemindForm";
import useFetching from "shared/hooks/useFetching";
import TaskManagementApi from "shared/api/TaskManagmentApi";
import {Input} from "shared/ui/Input";
import Spiner from "../../../shared/assets/img/spinner.svg"
import { Switcher } from "shared/ui/Switcher/ui/Switcher";
import { ModalHeader } from "shared/ui/ModalHeader/ui/ModalHeader";
import { ModalFooter } from "shared/ui/ModalFooter/ui/ModalFooter";


const PatchDeadlineModal = ({deadline, setDeadline, setHide, setHasUpdated, thisDeadline, isMobile = true }) => {
    let deadlineDate = Date.parse(thisDeadline.date)
    deadlineDate = new Date(deadlineDate)
    const [remindForm, setRemindForm] = useState(false)
    const [name, setName] = useState(thisDeadline.name)
    const [date, setDate] = useState(deadlineDate)
    const [newReminderTmp, setNewReminderTmp] = useState({
        days: [],
    })
    const [startValidation, setStartValidation] = useState(false)
    const [isPrevReminder, setIsPrevReminder] = useState()

    const [patchDeadline, isLoading] = useFetching(useCallback(async () => {
        return await TaskManagementApi.updateDeadline(thisDeadline._id, name, date, "active")
    }, [name, date]))
    const [createReminder, isPreLoading] = useFetching(useCallback(async () => {
        return await TaskManagementApi.createReminder({...newReminderTmp, entity_id: thisDeadline._id,
            hour: Number(newReminderTmp.hour), min: newReminderTmp.min >= 15 ? 30 : 0, type: "Дедлайн"})
    }, [newReminderTmp]))
    const [patchReminder, isPostLoading] = useFetching(useCallback(async () => {
        return await TaskManagementApi.patchReminder(newReminderTmp._id,
            {days: newReminderTmp.days, hour: Number(newReminderTmp.hour), min: newReminderTmp.min >= 15 ? 30 : 0,
            text: newReminderTmp.text, exp_date: newReminderTmp.exp_date})
    }, [newReminderTmp]))
    const [fetchThisReminder, isLoadingThisReminder, isThisReminderAbsence] = useFetching(useCallback(async () => {
        return await TaskManagementApi.getThisReminder(thisDeadline._id)
    }, [thisDeadline._id]))
    const [deleteReminder, isDeletingReminder] = useFetching(async () => {
        return await TaskManagementApi.deleteReminder(newReminderTmp._id)
    }, [])
    
    useEffect(() => {
        const fetchReminder = async () => {
            let res = await fetchThisReminder(thisDeadline._id)
            if (!res) return
            setIsPrevReminder(!res.errors)
            if(res.errors) {
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

    useLayoutEffect(() => {
        if (deadline) {
            gsap.to(".modal-deadline", { opacity: 1, zIndex: 500, duration: 0.05 })
            setTimeout(() => setHide(false), 1)
        } else {
            gsap.to(".modal-deadline", { opacity: 0, zIndex: -10, duration: 0.05 })
            setTimeout(() => setHide(true), 1)
        }
    }, [deadline]);

    function handlePatchDeadline() {
        if (!name || !date) setStartValidation(true) 
        else {
            patchDeadline()
            .then(res => {
                if (res.errors || !res) return
                setDeadline(false)
                setHasUpdated()
                setHide(true)
            })
            if(newReminderTmp._id) {
                deleteReminder()
            }
        }
    }
    function handlePatchReminder() {
        if(newReminderTmp.min >= 15) {
            setNewReminderTmp({...newReminderTmp, min: 30})
        } else if (newReminderTmp.min){
            setNewReminderTmp({...newReminderTmp, min: "00"})
        }
        if (!name || !date || !newReminderTmp.days.length || !newReminderTmp.min || !newReminderTmp.hour || !newReminderTmp.text) {
            setStartValidation(true)
        } else {
            patchDeadline()
                .then(res => {
                    if (res.errors || !res) return
            
                })
            if(isPrevReminder) {
                patchReminder()
                .then(res => {
                    if (res.errors || !res) return
                    setDeadline(false)
                    setHasUpdated()
                    setHide(true)
                })
            } else {
                createReminder()
                .then(res => {
                    if (res.errors || !res) return
                    setDeadline(false)
                    setHasUpdated()
                    setHide(true)
                })
            }
            }
        

    }

    const patchDeadlineFunc = () => {
        if (!remindForm) {
            handlePatchDeadline()
        } else (
            handlePatchReminder()
        )
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
                    setValue={(e) => { setDate(e)}}
                    placeholder="Дата"
                    validation={!date && startValidation}
                    validationText="Необходимо выбрать дату"
                />
                <ModalFooter
                    isMobile={isMobile}
                    submitFunction={() => patchDeadlineFunc()}
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
                onClick={() => {setDeadline(false), setHide(true)}}
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
                        validation={startValidation && !name}
                        validationText="Это поле должно быть заполнено"
                    />
                    <Input
                        type="date"
                        className="input__simple-input_dark"
                        value={date}
                        setValue={(e) => {setDate(e)}}
                        placeholder="Дата"
                        validation={startValidation && !date}
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
                                        type="Дедлайн"
                                    />}
                    <button
                        className="btn-shape__filled"
                        id="addNewDeadline"
                        type="submit"
                        style={{marginTop: remindForm ? 16 : 24, zIndex: 1}}
                        onClick={(e) => {patchDeadlineFunc(e)}}
                    >
                        {isLoading || isPreLoading || isPostLoading || isDeletingReminder ?  <Spiner className="loader"/> :  "Cохранить"}
                    </button>
                </fieldset>
            </form> */}
        </div>
    );
};

export default PatchDeadlineModal;
