import "pages/MainPage/ui/sass/main.scss"
import { useEffect, useState } from "react";
import { Checkbox } from "shared/ui/Checkbox";

const DayCheckbox = ({ day, newReminderTmp, setNewReminderTmp, isMobile}) => {

    let [checked, setChecked] = useState(newReminderTmp.days.includes(day))
    
    function handleToggleDay() {
        if (!checked) {
            setChecked(true)
            let newDays = [...newReminderTmp.days, day]
            setNewReminderTmp({...newReminderTmp, days: newDays})
        } else {
            setChecked(false)
            let newDays = [...newReminderTmp.days.filter(elem => elem !== day)]
            setNewReminderTmp({...newReminderTmp, days: newDays})
        }
    }

    return (
        <div className="field input__checkbox">
            <Checkbox
                idVar={day}
                handleClick={handleToggleDay}
                defChecked={checked}
                isDark={isMobile}
            />
            <label className="input__checkbox-descr-main" htmlFor={`checkbox-id-${day}`}>{day}</label>
        </div>
    );
};

export default DayCheckbox;
