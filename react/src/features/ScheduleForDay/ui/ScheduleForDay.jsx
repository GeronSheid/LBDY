import jwtDecode from 'jwt-decode'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import UniversityApi from 'shared/api/UniversityApi'
import useFetching from 'shared/hooks/useFetching'
import { LessonCard } from 'shared/ui/LessonCard'
import {TOKEN} from "shared/consts/storagesKeys";
import { LessonCardMobile } from 'shared/ui/LessonCardMobile'



export const ScheduleForDay = ({
  groupId, 
  lessonsModal, 
  setLessonsModal, 
  todayDate, 
  isMobile = false,

  data,
  setData,
  thisLessonModal,
  setThisLessonModal
}) => {
  const [schedule, setSchedule] = useState([])
  const todaysDate = new Date(todayDate).toISOString().slice(0, 10)
  const todaysIndex = new Date(todaysDate).getDay()
  const weekDays = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
  const curGroupId = useMemo(() => {
      if (groupId === "") {
          return jwtDecode(localStorage.getItem(TOKEN)).group_id
      } else {
          return groupId
      }
  }, [groupId])

  const [getTodaysSchedule] = useFetching(useCallback(async () => {
    return await UniversityApi.getWeekSchedule(todaysDate, todaysDate, curGroupId)
  }, [curGroupId, todaysDate]))

  const handleModalVallues = (data) => {
    setData(data)
  }

  useEffect(() => {
    getTodaysSchedule()
      .then(res => {
        if (res.errors || !res) return
        setSchedule(res.data.sort((a, b) => a.class_time.lesson_number - b.class_time.lesson_number))
      })
  }, [todaysDate, curGroupId])
  
  return (
    <>
      {isMobile 
        ?
        <div className='schedule-day-mobile'>
          {schedule.length != 0 
            ?
            schedule.map(lesson =>
              <LessonCardMobile
                data={lesson}
                lessonsModal={lessonsModal}
                setLessonsModal={setLessonsModal}
                handleModalVallues={handleModalVallues}
                setThisLessonModal={setThisLessonModal}
                thisLessonModa={thisLessonModal}
                groupId={groupId}
              />
            )
            :
            <div className='emptyList__title'>Выходной</div>
          }
        </div>
        :
        <div className='schedule-day'>
          <div className='schedule-day__header'>
            <div className='schedule-day__heading'>
              <b className='schedule-day__date_big'>{new Date(todayDate).toLocaleDateString('ru-RU').slice(0, -5)}</b>
              <span>{weekDays[todaysIndex]}</span>
            </div>
          </div>
          <div className='schedule-day__content'>
            { schedule && schedule.length > 0 ?
              schedule.sort((a, b) => a.class_time.lesson_number - b.class_time.lesson_number).map((lesson) =>
              <LessonCard
                key={lesson.class_time.lesson_number}
                lessonName={lesson?.subject?.name}
                lesson={lesson}
                lessonsModal={lessonsModal}
                setLessonsModal={setLessonsModal}
                isBig={true}
                groupId={groupId}
              />
              )
              :
              <span style={{fontSize: '24px'}}>Выходной</span>
            }
          </div>
        </div>
      }
    </>
  )
}