import "pages/MainPage/ui/sass/main.scss"
import { useEffect, useRef, useState, memo } from "react";
import useWindow from "shared/hooks/useWindow";
import shortString from "shared/lib/shortString";
import { ModalWrapper } from "shared/ui/ModalWrapper";
import { LessonModal } from "widgets/LessonModal";

const LessonCard = ({ lessonName, lesson, lessonsModal, setLessonsModal, isBig, refetchBool, setRefetchBool, isMobile=false, groupId}) => {
    const [thisLessonModal, setThisLessonModal] = useState(false)
    const [active, setActive] = useState(false)

    const lessonRef = useRef()
    const currentDate = new Date();
    const lessonDate = new Date(lesson.date);
    const lessonStart = lesson.class_time.start_of_class;
    const lessonEnd = lesson.class_time.end_of_class;
    const lessonStartHour = +lessonStart.split(':')[0];
    const lessonStartMinutes = +lessonStart.split(':')[1];
    const lessonEndHour = +lessonEnd.split(':')[0];
    const lessonEndMinutes = +lessonEnd.split(':')[1];
    const currentHour = currentDate.getHours()
    const currentMinutes = currentDate.getMinutes()
    const windowParams = useWindow();

    const tablet = 1024 < windowParams.windowWidth && windowParams.windowWidth <= 1440;

    const multiAudience = lesson.audience !== null ? (lesson.audience.indexOf('&') === -1 ? lesson.audience : '-') : '-';
    useEffect(() => {
        if((lessonStartHour < currentHour || (lessonStartHour === currentHour && lessonStartMinutes <= currentMinutes)) &&
            (lessonEndHour > currentHour || (lessonEndHour === currentHour && lessonEndMinutes > currentMinutes)) && (currentDate.toDateString() === lessonDate.toDateString())) {
            setActive(true)
        } else {
            setActive(false)
        }
    }, [])
    return (
        <>
            {lessonsModal && thisLessonModal &&
                <ModalWrapper>
                    <LessonModal
                        setLessonsModal={setLessonsModal}
                        setThisLessonModal={setThisLessonModal}
                        lesson={lesson}
                        refetchBool={refetchBool}
                        setHasUpdated={() => setRefetchBool(!refetchBool)}
                        groupId={groupId}
                    />
                </ModalWrapper>
            }
            <div 
                className={`schedule-day__lesson schedule-day__lesson_btn ${isBig && 'schedule-day__lesson_big'} ${active && isBig && 'schedule-day__lesson_active'}`}
                onClick={() => {setLessonsModal(true); setThisLessonModal(true);}}
                ref={lessonRef} 
            >
                <div className="schedule-day__lesson-number">{lesson.class_time.lesson_number}</div>
                <div className="schedule-day__lesson-content">
                    <p className="schedule-day__lesson-name">{tablet ? shortString(lessonName) : lessonName}</p>
                    {isMobile &&
                        <span>
                            {multiAudience.length > 5 ? '-' : multiAudience}
                        </span>
                    }
                    {isBig && 
                            <div className="schedule-day__lesson-info">
                                <div>
                                    {multiAudience}
                                </div>
                                <div>
                                    {lesson.teacher
                                    ?
                                        `${lesson?.teacher?.first_name} ${lesson?.teacher?.middle_name[0]}. ${lesson?.teacher?.last_name[0]}.` 
                                    :
                                        "-"}
                                </div>
                            </div>
                        }      
                </div>
            </div>
        </>
    );
};

export default memo(LessonCard);
