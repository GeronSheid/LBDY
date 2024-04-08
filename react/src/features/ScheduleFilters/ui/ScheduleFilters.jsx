import "pages/MainPage/ui/sass/main.scss"
import {useCallback, useEffect, useState} from "react";
import UniversityApi from "shared/api/UniversityApi";
import UserApi from "shared/api/UserApi";
import { myGroupId } from "shared/consts/usefullValues";
import useFetching from "shared/hooks/useFetching";
import {SelectorsGroup} from "widgets/SelectorsGroup";

const ScheduleFilters = ({setGroupId, setScheduleToggle, scheduleToggle, onClick, ref, isMobile=false}) => {
    const [faculty, setFaculty] = useState('')
    const [specialization, setSpecialization] = useState('')
    const [grade, setGrade] = useState('')
    const [group, setGroup] = useState('')
    const setFacultyFunc = (option) => {
        if (option !== faculty) {
            setFaculty(option) 
            setSpecialization("")
            setGrade("")
            setGroup("")

        }
    }

    const setSpecializationFunc = (option) => {
        if (specialization !== option) {
            setSpecialization(option)   
            setGrade("")
            setGroup("")

        }
    }

    const setGradeFunc = (option) => {
        if (option !== grade) {
            setGrade(option)    
            setGroup("")
        }
    }

    return (
        <>
            {isMobile 
                ?
                <div className="schedule-filters" ref={ref}>
                    <form className="form">
                        <div className="schedule-filters__mobile-header">
                            <legend className="legend">Фильтрация</legend>
                            <button onClick={(e) => {
                                e.preventDefault()
                                onClick(false)
                            }}>Закрыть</button>
                        </div>
                        <fieldset className="form__fieldset">
                            <div className="field-wrapper">
                                <SelectorsGroup
                                    faculty={faculty}
                                    specialization={specialization}
                                    setFaculty={setFacultyFunc}
                                    setSpecialization={setSpecializationFunc}
                                    setGrade={setGradeFunc}
                                    grade={grade}
                                    group={group}
                                    setGroup={setGroup}
                                    setGroupId={setGroupId}
                                    className="field_light"
                                    setId={true}
                                />
                            </div>
                            <button onClick={(e) => {e.preventDefault(); setGroupId(myGroupId); onClick(false)}} className="btn-shape__filled">Сбросить</button>
                        </fieldset>
                    </form>
                </div>
                :
                <div className="schedule-filters">
                    <div className="schedule-filters__btns">
                        <button
                            className={`btn-text__tab_light ${scheduleToggle && 'btn-text__tab_light_active'}`}
                            id="scheduleDayBtn"
                            type="button"
                            onClick={() => {setScheduleToggle(true); localStorage.setItem("scheduleToggle", true)}}
                        >
                            День
                        </button>
                        <button
                            className={`btn-text__tab_light ${!scheduleToggle && 'btn-text__tab_light_active'}`}
                            id="scheduleWeekBtn"
                            type="button"
                            onClick={() => {setScheduleToggle(false); localStorage.setItem("scheduleToggle", false)}}
                        >
                            Неделя
                        </button>
                    </div>
                    <form className="form">
                        <legend className="legend">Раписание занятий</legend>
                        <fieldset className="form__fieldset">
                            <div className="field-wrapper grid-wrapper">
                                <SelectorsGroup
                                    faculty={faculty}
                                    specialization={specialization}
                                    setFaculty={setFacultyFunc}
                                    setSpecialization={setSpecializationFunc}
                                    setGrade={setGradeFunc}
                                    grade={grade}
                                    group={group}
                                    setGroup={setGroup}
                                    setGroupId={setGroupId}
                                    className="field_dark"
                                    setId={true}
                                />
                            </div>
                        </fieldset>
                    </form>
                </div>
            }
        </>
    );
};

export default ScheduleFilters;
