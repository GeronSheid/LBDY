import "pages/MainPage/ui/sass/main.scss"
import {ScheduleDay} from "entities/ScheduleDay";
import useFetching from "shared/hooks/useFetching";
import {useCallback, useEffect, useMemo, useState} from "react";
import UniversityApi from "shared/api/UniversityApi";
import jwtDecode from "jwt-decode";
import {TOKEN} from "shared/consts/storagesKeys";

const ScheduleDays = ({week, groupId, lessonsModal, setLessonsModal, refetchBool, setRefetchBool, isMobile=false}) => {
    const currentDate = new Date()
    const indexes = [1, 2, 3, 4, 5, 6]
    const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
    const dateFrom = useMemo(() => {
        if (week.length !== 0) return week[1].date.toISOString().slice(0, 10)
    }, [week])
    const dateTo = useMemo(() => {
        if (week.length !== 0) return week[0].date.toISOString().slice(0, 10)
    }, [week])
    const curGroupId = useMemo(() => {
        if (groupId === "") {
            return jwtDecode(localStorage.getItem(TOKEN)).group_id
        } else {
            return groupId
        }
    }, [groupId])
    const [getWeekSchedule] = useFetching(useCallback(async () => {
        return await UniversityApi.getWeekSchedule(dateFrom, dateTo, curGroupId)
    }, [dateFrom, dateTo, curGroupId]))
    const [schedule, setSchedule] = useState([{}])
    useEffect(() => {
        if (dateTo === undefined || dateFrom === undefined) return
        getWeekSchedule()
            .then(res => {
                if (res.errors || !res) return
                setSchedule(res.data)
            })
    }, [dateFrom, dateTo, curGroupId]);
    return (
        <div className={isMobile ? "schedule__days_mobile" : "schedule__days"}>
            {week.length !== 0 && indexes.map(index =>
                <ScheduleDay
                    isMobile={isMobile}
                    key={index}
                    date={week[index].date.getDate() + "." + months[week[index].date.getMonth()]}
                    weekday={week[index].weekday}
                    active={
                        week[index].date.getDate() === currentDate.getDate()
                        && week[index].date.getMonth() === currentDate.getMonth()
                        && week[index].date.getFullYear() === currentDate.getFullYear()
                    }
                    daySchedule={schedule.filter(data => data.date === week[index].date.toISOString().slice(0, 10))}
                    lessonsModal={lessonsModal}
                    setLessonsModal={setLessonsModal}
                    refetchBool={refetchBool}
                    setRefetchBool={setRefetchBool}
                    groupId={groupId}
                />
            )}
        </div>
    );
};

export default ScheduleDays;
