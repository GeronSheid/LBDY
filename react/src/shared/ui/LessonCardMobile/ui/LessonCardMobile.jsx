import { useEffect, useState } from 'react';
import './lessonCardMobile.scss';
import { ModalWrapper } from "shared/ui/ModalWrapper";
import { LessonModal } from "widgets/LessonModal";
import { myGroupId } from 'shared/consts/usefullValues';

export const LessonCardMobile = ({ 
  data,
  setLessonsModal = () => {},
  handleModalVallues = () => {},
  thisLessonModal,
  setThisLessonModal,
  isDay = false,
  groupId

}) => {
  const [active, setActive] = useState(false);

  const currentDate = new Date();
  const lessonDate = new Date(data.date);
  const lessonStart = data.class_time.start_of_class;
  const lessonEnd = data.class_time.end_of_class;
  const lessonStartHour = +lessonStart.split(':')[0];
  const lessonStartMinutes = +lessonStart.split(':')[1];
  const lessonEndHour = +lessonEnd.split(':')[0];
  const lessonEndMinutes = +lessonEnd.split(':')[1];
  const currentHour = currentDate.getHours()
  const currentMinutes = currentDate.getMinutes()
  const todaysIndex = currentDate.getDay();
  const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

  const multiAudience = data?.audience !== null ? (data?.audience.indexOf('&') === -1 ? data?.audience : '-') : '-';
  
  useEffect(() => {
    if ((lessonStartHour < currentHour || (lessonStartHour === currentHour && lessonStartMinutes <= currentMinutes)) &&
      (lessonEndHour > currentHour || (lessonEndHour === currentHour && lessonEndMinutes > currentMinutes)) && (currentDate.toDateString() === lessonDate.toDateString())) {
      setActive(true)
    } else {
      setActive(false)
    }
  }, [])
  return (
      <div
        style={isDay ? {height: 200} : null}
        className={active ? 'lessonCardMobile lessonCardMobile_active' : 'lessonCardMobile'}
        onClick={data.isDayOff ? null : () => {setLessonsModal(true); setThisLessonModal(true); handleModalVallues(data)}}
      >
        <div className='lessonCardMobile__header'>
          <b>{isDay ? new Date(data?.date).toLocaleDateString('ru-RU') : `${data?.class_time.lesson_number} ${data?.subject.name}`}</b>
          <span>{isDay ? weekDays[todaysIndex].slice(0, 2) : multiAudience}</span>
        </div>
        <div className='lessonCardMobile__content'>
          {isDay &&
            <>
              <div className='lessonCardMobile__title'>
              <b>
                {data.isDayOff ? data.subject.name : `${data?.class_time.lesson_number}. ${data?.subject.name}`}
              </b>
              <span>
                {multiAudience}
              </span>
            </div>
            </>
          }
            <div
              className='lessonCardMobile__time'
            >
              {data.occupation.name}
            </div>
            <div
              className='lessonCardMobile__time'
            >
              {data.isDayOff ? '' : `${data.class_time.start_of_class.slice(0, 5)} - ${data.class_time.end_of_class.slice(0, 5)}`}
            </div>
          <div className='lessonCardMobile__time'>
            {data.teacher
              ?
              `${data.teacher.middle_name} ${data.teacher.first_name} ${data.teacher.last_name}`
              :
              ''
            }
          </div>
          {isDay && myGroupId !== groupId &&
            <div className='lessonCardMobile__teacher'>
              {`Группа ${groupId}`}
            </div>
          }
        </div>
      </div>
  )
}
