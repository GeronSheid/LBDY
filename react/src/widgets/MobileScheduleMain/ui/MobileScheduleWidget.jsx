import { useEffect, useState } from "react";

import { currentDate, myGroupId } from "shared/consts/usefullValues";
import { LessonCardMobile } from "shared/ui/LessonCardMobile";
import { ModalWrapper } from "shared/ui/ModalWrapper";
import useFetching from "shared/hooks/useFetching";
import UniversityApi from "shared/api/UniversityApi";
import { LessonModal } from "widgets/LessonModal";

import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import './mobileScheduleWidget.scss';




const MobileScheduleMain = ({
  onClick,
  lessonsModal,
  setLessonsModal,
  refetchBool,
  setRefetchBool,
  groupId,

  data,
  setData,
  thisLessonModal,
  setThisLessonModal
}) => {

  const [todayLessons, setTodayLessons] = useState([]);
  const [index, setIndex] = useState(0)
  //Функции запроса данных с сервера
  const [lessons, loadingLessons] = useFetching(async () => {
    return await UniversityApi.getWeekSchedule(currentDate, currentDate, groupId)
  });
  const today = `${new Date()?.getFullYear()}-${(new Date()?.getMonth() + 1).toString().length === 1 ? '0' + (new Date()?.getMonth() + 1).toString() : (new Date()?.getMonth() + 1).toString()}-${new Date()?.getDate() .toString().length === 1 ? '0' + new Date()?.getDate().toString() : new Date()?.getDate().toString()}`;
  const currentHour = new Date().getHours()
  const currentMinute = new Date().getMinutes()
  useEffect(() => {
    lessons()
      .then(res => {
        if (!res || res.error) return
        setTodayLessons([...res.data].sort((a, b) => a.class_time.lesson_number - b.class_time.lesson_number))
      })
  }, [groupId])

  const handleModalVallues = (data) => {
    setData(data)
  }
  const checkActiveTime = (data) => {
    if(data.date === today) {
      const lessonStart = data.class_time.start_of_class;
      const lessonEnd = data.class_time.end_of_class;
      const lessonStartHour = +lessonStart.split(':')[0];
      const lessonStartMinutes = +lessonStart.split(':')[1];
      const lessonEndHour = +lessonEnd.split(':')[0];
      const lessonEndMinutes = +lessonEnd.split(':')[1];
      if((lessonStartHour < currentHour || (lessonStartHour === currentHour && lessonStartMinutes <= currentMinute)) &&
        (lessonEndHour > currentHour || (lessonEndHour === currentHour && lessonEndMinutes > currentMinute))) {
          return true
        }
    } else {
      return false
    }
  }
  
  useEffect(() => {
    const index = todayLessons.findIndex(lesson => checkActiveTime(lesson));
    if(index >= 0) {
      setIndex(index)
    } else {
      setIndex(0)
    }
  }, [todayLessons])

  const dayOffData = {
    isDayOff: true,
    audience: '',
    class_time: {
      lesson_number: '',
      start_of_class: '',
      end_of_class: ''
    },
    group: {
      name: ''
    },
    id: '',
    occupation: {
      name: ''
    },
    subject: {
      name: 'Выходной',
      reductions: null
    },
    teacher: '',
    date: new Date()
  }
  return (
    <>
      {LessonModal && thisLessonModal &&
        <ModalWrapper>
          <LessonModal
            lesson={data}
            lessonsModal={lessonsModal}
            setLessonsModal={setLessonsModal}
            refetchBool={refetchBool}
            setRefetchBool={setRefetchBool}
            setThisLessonModal={setThisLessonModal}
            groupId={groupId}
          />
        </ModalWrapper>
      }
      <div className="mobileScheduleWidget">
        <button
          className="legend mobileScheduleWidget__legend"
          onClick={onClick}
        >
          Расписание</button>
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          slidesPerView={1}
          spaceBetween={8}
          initialSlide={index}
        >
          {todayLessons.length !== 0
            ?
            todayLessons.map((lesson) => (
              <SwiperSlide
                key={lesson.id}
                className="mobileScheduleWidget__slider-slide"
              >
                <LessonCardMobile
                  data={lesson}
                  isDay={true}
                  lessonsModal={lessonsModal}
                  setLessonsModal={setLessonsModal}
                  refetchBool={refetchBool}
                  setRefetchBool={setRefetchBool}
                  handleModalVallues={handleModalVallues}
                  setThisLessonModal={setThisLessonModal}
                  thisLessonModa={thisLessonModal}
                  groupId={groupId}
                />
              </SwiperSlide>
            ))
            :
            <LessonCardMobile data={dayOffData} isDay={true} groupId={groupId}/>
          }
        </Swiper>
      </div>
    </>
  );
}

export default MobileScheduleMain;