import {useState} from "react";

export default function useDate (switchWeek = 0) {
    const [week, setWeek] = useState([])
    const days = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

    const makeWeek = (weekCounter = switchWeek) => {
        setWeek(days.map((day, index) => findThisWeekday(index, weekCounter)))
    }
    const findThisWeekday = (weekId, switchWeek = switchWeek) => {
        const currentDate = new Date();
        const currentDayOfWeek = currentDate.getDay();
        let daysUntilWeekday = weekId === 0 ? 7 - currentDayOfWeek + switchWeek : weekId - currentDayOfWeek + switchWeek;
        if (currentDayOfWeek === 0) daysUntilWeekday = weekId - 7 + switchWeek
        if (weekId == currentDayOfWeek) daysUntilWeekday = 0 + switchWeek
        currentDate.setDate(currentDate.getDate() + daysUntilWeekday)

        return {
            weekday: days[currentDate.getDay()],
            date: currentDate
        }
    };

    return [week, makeWeek]
};
