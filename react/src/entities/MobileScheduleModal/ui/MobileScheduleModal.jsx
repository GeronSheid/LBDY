import { MobileTab } from 'shared/ui/MobileTab';
import './mobileScheduleModal.scss';
import Properties from 'shared/assets/img/properties.svg';
import { useState } from 'react';
import { DateChanger } from 'features/DateChanger';
import { ScheduleForDay } from 'features/ScheduleForDay';
import { ScheduleDays } from 'features/ScheduleDays';

export const MobileScheduleModal = ({
  onClick,
  myRef,
  todayDate,
  setTodayDate,
  dayStep,
  yesterday,
  tomorrow,
  prevCounter,
  setPrevCounter,
  nextCounter,
  setNextCounter,
  week,
  prevWeek,
  nextWeek,
  changeSchedule,
  toLocaleDateString,
  groupId,
  lessonsModal,
  setLessonsModal,
  refetchBool,
  setRefetchBool,
  handleFilters,

  data,
  setData,
  thisLessonModal,
  setThisLessonModal
}) => {
  const [dayOrWeek, setDayOrWeek] = useState(false)

  return (
    <div className='mobileScheduleModal' ref={myRef}>
      <button className='mobileScheduleModal__btn' onClick={onClick}></button>
      <div className='mobileScheduleModal__content'>
        <div className='mobileScheduleModal__title-row'>
          <legend className='mobileScheduleModal__legend'>
            Расписание
          </legend>
          <button onClick={() => handleFilters(true)}>
            <Properties />
          </button>
        </div>
        <MobileTab tab1={'День'} tab2={'Неделя'} checked={dayOrWeek} setChecked={setDayOrWeek} />
        <DateChanger
          scheduleToggle={!dayOrWeek}
          todayDate={todayDate}
          setTodayDate={setTodayDate}
          dayStep={dayStep}
          yesterday={yesterday}
          tomorrow={tomorrow}
          prevCounter={prevCounter}
          setPrevCounter={setPrevCounter}
          nextCounter={nextCounter}
          setNextCounter={setNextCounter}
          week={week}
          prevWeek={prevWeek}
          nextWeek={nextWeek}
          changeSchedule={changeSchedule}
          toLocaleDateString={toLocaleDateString}
          isMobile={true}
        />
        {!dayOrWeek
          ?
          <ScheduleForDay
            isMobile={true}
            todayDate={todayDate}
            groupId={groupId}
            lessonsModal={lessonsModal}
            setLessonsModal={setLessonsModal}
            refetchBool={refetchBool}
            setRefetchBool={setRefetchBool}
            setData={setData}
            data={data}
            thisLessonModal={thisLessonModal}
            setThisLessonModal={setThisLessonModal}
          />
          :
          <ScheduleDays
            isMobile={true}
            week={week}
            groupId={groupId}
            lessonsModal={lessonsModal}
            setLessonsModal={setLessonsModal}
            refetchBool={refetchBool}
            setRefetchBool={setRefetchBool}
          />
        }
      </div>
    </div>
  )
}
