import "pages/MainPage/ui/sass/main.scss"
import {DayCheckbox} from "shared/ui/DayCheckbox";
import { useEffect, useState } from "react";
import {Input} from "shared/ui/Input";


const RemindForm = ({validation, newReminderTmp, setNewReminderTmp, date, type, isMobile=false}) => {
    const [hourDisabled, setHourDisabled] = useState(true)
    const [minDisabled, setMinDisabled] = useState(true)
    const [textDisabled, setTextDisabled] = useState(true)
    const [minFocus, setMinFocus] = useState(false)
    const [hourFocus, setHourFocus] = useState(false)
    const formatedDate = date ? `${date?.getFullYear()}-${(date?.getMonth() + 1).toString().length === 1 ? '0' + (date?.getMonth() + 1).toString() : (date?.getMonth() + 1).toString()}-${date?.getDate() .toString().length === 1 ? '0' + date?.getDate().toString() : date?.getDate().toString()}` : null;

    const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]

    useEffect(() => {
        if (minFocus) {
            if(!newReminderTmp.min) {
                setNewReminderTmp({...newReminderTmp, min: ""})
                setMinFocus(false)
                return
            }
            if(newReminderTmp.min >= 15) {
                setNewReminderTmp({...newReminderTmp, min: 30})
            } else {
                setNewReminderTmp({...newReminderTmp, min: "00"})
            }
            setMinFocus(false)
        }
    }, [minFocus])
    useEffect(() => {
        if (hourFocus) {
            if(!newReminderTmp.hour && newReminderTmp.hour !== 0 ) {
                setNewReminderTmp({...newReminderTmp, hour: ""})
                setHourFocus(false)
                return
            }
            if(newReminderTmp.hour >= 23) {
                setNewReminderTmp({...newReminderTmp, hour: 23})
            }
            setHourFocus(false)
        }
    }, [hourFocus])


    function setMin(min)  {
        setNewReminderTmp({...newReminderTmp, min})
    }
    function setHour(hour)  {
        setNewReminderTmp({...newReminderTmp, hour: hour})
    }

    function setText(text)  {
        let exp_date = formatedDate
        setNewReminderTmp({...newReminderTmp, text, exp_date, entity_type: type})
    }

    useEffect(() => {
        if(newReminderTmp.days.length) {
            setHourDisabled(false)
        } else {
            setHourDisabled(true)
        }
        if(newReminderTmp.hour < 24 && newReminderTmp.hour > -1) {
            setMinDisabled(false)
        } else {
            setMinDisabled(true)
        }
        if(newReminderTmp.min < 60 && newReminderTmp.min > -1) {
            setTextDisabled(false)
        } else {
            setTextDisabled(true)
        }
    }, [newReminderTmp])
        

    return (
        <div className="modal-remind-form" id="modelRemind  FormProject">
            <div className="modal-remind-form__days-wrapper">
                <div className="modal-remind-form__days">
                    {weekDays.map(day => 
                        <DayCheckbox 
                            isMobile={isMobile}
                            newReminderTmp={newReminderTmp} 
                            setNewReminderTmp={setNewReminderTmp} 
                            key={day} 
                            day={day} 
                        />)
                    }
                </div>
                {(validation && (newReminderTmp.days.length === 0)) &&
                    <div className="validationText">
                        Необходимо выбрать хотя бы один день 
                    </div>
                }
            </div>
            <div className="field-wrapper">
                    <Input
                        setValue={(e) => setHour(e.target.value)}
                        className={isMobile ? "input__simple-input_light" : "input__simple-input_dark"}
                        type="number"
                        name="hour"
                        onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                        placeholder="Час"
                        value={newReminderTmp.hour}
                        validation={validation && !newReminderTmp.hour}
                        validationText="Поле должно быть заполнено"
                        setFocus={() => setHourFocus(true)}
                    />
                    <Input
                        setValue={(e) => setMin(e.target.value)}
                        className={isMobile ? "input__simple-input_light" : "input__simple-input_dark"}
                        type="number"
                        name="minutes"
                        onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                        placeholder="Минуты"
                        value={newReminderTmp.min}
                        validation={validation && !newReminderTmp.min}
                        validationText="Поле должно быть заполнено"
                        setFocus={() => setMinFocus(true)}
                    />
            </div>
                <Input
                    setValue={(e) => setText(e.target.value)}
                    className={isMobile ? "input__simple-input_light" : "input__simple-input_dark"}
                    type="text"
                    name="text"
                    placeholder="Текст напоминания"
                    validation={validation && !newReminderTmp.text}
                    value={newReminderTmp.text}
                    validationText="Поле должно быть заполнено"
                />
        </div>
    );
};

export default RemindForm;
