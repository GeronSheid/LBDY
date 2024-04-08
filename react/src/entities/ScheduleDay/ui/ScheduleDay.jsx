import { CreateHometasksModal } from "entities/CreateHomeworksModal";
import "pages/MainPage/ui/sass/main.scss"
import { useState } from "react";
import { Scrollbar } from "react-scrollbars-custom";
import {classNames} from "shared/lib/classNames";
import {LessonCard} from "shared/ui/LessonCard";
import { LessonModal } from "widgets/LessonModal";

const ScheduleDay = ({
    date,
    weekday,
    active,
    daySchedule,
    lessonsModal,
    setLessonsModal,
    refetchBool,
    setRefetchBool,
    isMobile = false,
    groupId
}) => {
    //Добавление нуля перед цифрой, для приведения к нужному формату даты
    const splitedDate = date.split('.')
    splitedDate[0].length === 1 ? splitedDate[0] = '0' + splitedDate[0] : splitedDate[0]
    const formatedDate = splitedDate.join('.')
    const sort = (a, b) => {
        return a.class_time.lesson_number - b.class_time.lesson_number
    }
    return (
        <>
            <div className={classNames(
                "schedule-day",
                {["schedule-day_active"]: active,},
                []
            )}
            >
                <div className="schedule-day__header">
                    <div className="schedule-day__date">{formatedDate}</div>
                    <div className="schedule-day__abbr">{weekday}</div>
                </div>
                <div className="schedule-day__lessons" >
                    {isMobile 
                        ? 
                        <>
                            {daySchedule.length !== 0 ?
                                daySchedule.sort(sort)
                                    .map((lesson) =>
                                        <LessonCard
                                            isMobile={isMobile}
                                            key={lesson.id}
                                            index={lesson.class_time.lesson_number}
                                            lessonName={lesson.subject.name}
                                            lesson={lesson}
                                            setLessonsModal={setLessonsModal}
                                            lessonsModal={lessonsModal}
                                            refetchBool={refetchBool}
                                            setRefetchBool={setRefetchBool}
                                            groupId={groupId}
                                        />
                                    )
                                :
                                <div className="schedule-day__lesson-name">
                                    <span className="schedule-day__lesson schedule-day__lesson_offset">
                                        Выходной
                                    </span>
                                </div>

                            }
                        </>
                        :
                        <Scrollbar
                            elementRef
                            trackYProps={{ style: { width: "4px", background: "transparent", marginRight: 4, } }}
                            thumbYProps={{ style: { background: "#FFF", minHeight: "50px", maxHeight: "50px", opacity: 0.5, color: "white" } }}
                            // trackXProps={{ style: { width: "4px", background: "transparent", marginRight: 5 } }}
                            // thumbXProps={{ style: { background: "#687074", maxHeight: "100%", opacity: 0.5 } }}
                            noScrollX={true}
                        >
                            {daySchedule.length !== 0 ?
                                daySchedule.sort(sort)
                                    .map((lesson) =>
                                        <LessonCard
                                            key={lesson.id}
                                            index={lesson.class_time.lesson_number}
                                            lessonName={lesson.subject.name}
                                            lesson={lesson}
                                            setLessonsModal={setLessonsModal}
                                            lessonsModal={lessonsModal}
                                            refetchBool={refetchBool}
                                            setRefetchBool={setRefetchBool}
                                            groupId={groupId}
                                        />
                                    )
                                :
                                <div className="schedule-day__lesson-name">
                                    <span className="schedule-day__lesson schedule-day__lesson_offset">
                                        Выходной
                                    </span>
                                </div>

                            }
                        </Scrollbar>
                    }
                    
                </div>
            </div>
        </>
    );
};

export default ScheduleDay;
