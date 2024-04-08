import "pages/MainPage/ui/sass/main.scss"
import { Sidebar } from "widgets/Sidebar";
import { Projects } from "features/Projects";
import { HomeworksAndDeadlines } from "features/HomeworksAndDeadlines";
import { ScheduleFilters } from "features/ScheduleFilters";
import { ScheduleDays } from "features/ScheduleDays";
import useDate from "shared/hooks/useDate";
import { Suspense, useEffect, useRef, useState } from "react";
import { ScheduleForDay } from "features/ScheduleForDay";
import useWindow from "shared/hooks/useWindow";
import { TabBar } from "widgets/TabBar";
import { MobileScheduleWidget } from "widgets/MobileScheduleMain";
import { CSSTransition } from 'react-transition-group';
import { MobileScheduleModal } from "entities/MobileScheduleModal/ui/MobileScheduleModal";
import { DateChanger } from "features/DateChanger";
import { ModalWrapper } from "shared/ui/ModalWrapper";
import { Header } from "widgets/Header";
import UserApi from "shared/api/UserApi";
import LbdyNetwork from "shared/config/httpConfig";
import useFetching from "shared/hooks/useFetching";
import { myGroupId } from "shared/consts/usefullValues";


const MainPage = () => {
    const [week, makeCurrWeek] = useDate()
    const [prevWeek, makePrevWeek] = useDate(-7)
    const [nextWeek, makeNextWeek] = useDate(7)
    const [prevCounter, setPrevCounter] = useState(1)
    const [nextCounter, setNextCounter] = useState(1)
    const [projectsModal, setProjectsModal] = useState(false)
    const [homeworksModal, setHomeworksModal] = useState(false)
    const [lessonsModal, setLessonsModal] = useState(false)
    const [groupId, setGroupId] = useState(myGroupId)
    const [scheduleToggle, setScheduleToggle] = useState(localStorage.scheduleToggle ? JSON.parse(localStorage.getItem("scheduleToggle")) : false)
    const [refetchBool, setRefetchBool] = useState(false)
    const [todayDate, setTodayDate] = useState(new Date().getTime())
    const { windowWidth, windowHeight, orientation } = useWindow();
    const [mobileScheduleOpen, setMobileScheduleOpen] = useState(false);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [myData, setMyData] = useState({})
    const [data, setData] = useState({})
    const [thisLessonModal, setThisLessonModal] = useState(false)

    const nodeRef = useRef(null);
    const filtersRef = useRef(null);
    const isMobile = windowWidth <= 1024 || windowHeight <= 600;
    const dayStep = 1000 * 3600 * 24
    let yesterday = todayDate - dayStep
    let tomorrow = todayDate + dayStep

    const [fetchMe] = useFetching(async () => {
        return await UserApi.usersMe()
    })

    useEffect(() => {
        fetchMe()
            .then(res => {
                if (!res || res.errors) return
                setMyData(res.data)
                setGroupId(res.data.group_id)

            })
    }, [])

    useEffect(() => {
        makeCurrWeek()
        makePrevWeek()
        makeNextWeek()
        document.title = 'Элбади - Главная'
    }, []);

    const changeSchedule = (changeDays) => {
        makeCurrWeek(changeDays)
        makePrevWeek(changeDays - 7)
        makeNextWeek(changeDays + 7)
    }

    const toLocaleDateString = (date) => {
        if (date.getDate() < 10 && date.getMonth() + 1 < 10) {
            return '0' + date.getDate() + '.0' + (date.getMonth() + 1) + '.' + date.getFullYear()
        } else if (date.getDate() >= 10 && date.getMonth() + 1 < 10) {
            return date.getDate() + '.0' + (date.getMonth() + 1) + '.' + date.getFullYear()
        } else if (date.getDate() < 10 && date.getMonth() + 1 >= 10) {
            return '0' + date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear()
        }
        return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear()
    }

    return (
        <>
            <div className='main-container'>
                {!isMobile && <Sidebar />}
                {isMobile
                    ?
                    <div className="main-container__modal-wrap">
                        <Header title='Главная' />
                        <Suspense fallback={'Loading...'}>
                            <MobileScheduleWidget
                                onClick={
                                    () => {
                                        document.getElementsByClassName("reminders")[0].style.display = "none";
                                        document.getElementsByClassName("projects")[0].style.display = "none";
                                        setMobileScheduleOpen(true);
                                    }
                                }
                                lessonsModal={lessonsModal}
                                setLessonsModal={setLessonsModal}
                                refetchBool={refetchBool}
                                setRefetchBool={setRefetchBool}
                                groupId={groupId}
                                data={data}
                                setData={setData}
                                thisLessonModal={thisLessonModal}
                                setThisLessonModal={setThisLessonModal}
                            />
                        </Suspense>
                        <CSSTransition
                            nodeRef={filtersRef}
                            classNames='mobileFilters'
                            in={mobileFiltersOpen}
                            timeout={200}
                            unmountOnExit
                        >
                            <ModalWrapper nodeRef={filtersRef}>
                                <ScheduleFilters
                                    setGroupId={setGroupId}
                                    setScheduleToggle={setScheduleToggle}
                                    scheduleToggle={scheduleToggle}
                                    onClick={setMobileFiltersOpen}
                                    isMobile={true}
                                />
                            </ModalWrapper>
                        </CSSTransition>
                        <CSSTransition
                            nodeRef={nodeRef}
                            classNames='mobileScheduleModalView'
                            in={mobileScheduleOpen}
                            timeout={200}
                            unmountOnExit
                        >
                            <MobileScheduleModal
                                onClick={() => {
                                    document.getElementsByClassName("reminders")[0].style.display = "block";
                                    document.getElementsByClassName("projects")[0].style.display = "block";
                                    setMobileScheduleOpen(false)
                                }}
                                myRef={nodeRef}
                                week={week}
                                scheduleToggle={scheduleToggle}
                                todayDate={todayDate}
                                setTodayDate={setTodayDate}
                                dayStep={dayStep}
                                yesterday={yesterday}
                                tomorrow={tomorrow}
                                prevCounter={prevCounter}
                                setPrevCounter={setPrevCounter}
                                nextCounter={nextCounter}
                                setNextCounter={setNextCounter}
                                prevWeek={prevWeek}
                                nextWeek={nextWeek}
                                changeSchedule={changeSchedule}
                                toLocaleDateString={toLocaleDateString}
                                handleFilters={setMobileFiltersOpen}

                                groupId={groupId}
                                lessonsModal={lessonsModal}
                                setLessonsModal={setLessonsModal}
                                refetchBool={refetchBool}
                                setRefetchBool={setRefetchBool}

                                data={data}
                                setData={setData}
                                thisLessonModal={thisLessonModal}
                                setThisLessonModal={setThisLessonModal}

                            />
                        </CSSTransition>
                        <HomeworksAndDeadlines
                            isMobile={isMobile}
                            homeworksModal={homeworksModal}
                            setHomeworksModal={setHomeworksModal}
                            refetchBool={refetchBool}
                            setRefetchBool={setRefetchBool}
                        />
                        <Projects projectsModal={projectsModal} setProjectsModal={setProjectsModal} isMobile={true} />
                    </div>
                    :
                    <>
                        <Projects
                            projectsModal={projectsModal}
                            setProjectsModal={setProjectsModal}
                        />
                        <HomeworksAndDeadlines
                            homeworksModal={homeworksModal}
                            setHomeworksModal={setHomeworksModal}
                            refetchBool={refetchBool}
                            setRefetchBool={setRefetchBool}
                        />
                        <div className="schedule">
                            <ScheduleFilters setGroupId={setGroupId} setScheduleToggle={setScheduleToggle} scheduleToggle={scheduleToggle} />
                            {scheduleToggle
                                ?
                                <ScheduleForDay
                                    todayDate={todayDate}
                                    groupId={groupId}
                                    lessonsModal={lessonsModal}
                                    setLessonsModal={setLessonsModal}
                                    refetchBool={refetchBool}
                                    setRefetchBool={setRefetchBool}
                                />
                                :
                                <ScheduleDays
                                    week={week}
                                    groupId={groupId}
                                    lessonsModal={lessonsModal}
                                    setLessonsModal={setLessonsModal}
                                    refetchBool={refetchBool}
                                    setRefetchBool={setRefetchBool}
                                />
                            }
                        </div>
                        <DateChanger
                            scheduleToggle={scheduleToggle}
                            todayDate={todayDate}
                            setTodayDate={setTodayDate}
                            dayStep={dayStep}
                            yesterday={yesterday}
                            tomorrow={tomorrow}
                            prevCounter={prevCounter}
                            setPrevCounter={setPrevCounter}
                            nextCounter={nextCounter}
                            setNextCounter={setNextCounter}
                            prevWeek={prevWeek}
                            nextWeek={nextWeek}
                            changeSchedule={changeSchedule}
                            toLocaleDateString={toLocaleDateString}
                        />
                    </>}

            </div>
            {isMobile && <TabBar /> }
        </>
    );
};

export default MainPage;
