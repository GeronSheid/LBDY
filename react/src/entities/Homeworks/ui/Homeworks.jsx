import "pages/MainPage/ui/sass/main.scss"
import "entities/Homeworks/ui/Homeworks.scss"
import { useEffect, useState } from "react";
import TaskManagementApi from "shared/api/TaskManagmentApi";
import useFetching from "shared/hooks/useFetching";
import { Homework } from "shared/ui/Homework/ui/Homework";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import useWindow from "shared/hooks/useWindow";
import { IconButton } from "shared/ui/IconButton";
import ArchiveIcon from "shared/assets/img/archive-shaped.svg";

const Homeworks = ({
        refetchBool, 
        refetchFiles, 
        setHidePatchModal, 
        setHomework, 
        setShowModal,
        setShowDeadlines, 
        setHideArchiveModal,
        setHideCreateModal,
        setHomeworkDate, 
        isEmpty, 
        isMobile=false,
        setShowArchive
    }) => {
    const [homeworks, setHomeworks] = useState([])
    const [refetchHomeworksBool, setRefetchHomeworksBool] = useState(false)
    const { windowWidth, windowHeight, orientation } = useWindow();
    const desktop = windowWidth > 1440 && windowHeight > 960;
    const tablet = !desktop && !isMobile;

    const [getHomeworks] = useFetching(async () => {
        return await TaskManagementApi.getHomeTasks('active')
    })
    useEffect(() => {
        getHomeworks()
            .then(res => {
                if (res.errors || !res) return
                setHomeworks(res.data)
            })
    }, [refetchBool, refetchHomeworksBool])

    useEffect(() => {
        if(homeworks.length === 0) {
            isEmpty(true)
        } else {
            isEmpty(false)
        }
    }, [homeworks])

    let sorted = homeworks.length !== 0 ? homeworks.sort((a, b) => new Date(a.date) - new Date(b.date)) : []

    
    const SplitByNumber = (number) => {
        let splittedByNumber = [];
        for(let i = 0; i < sorted.length; i += number) {
            splittedByNumber.push(sorted.slice(i, i + number));
        }
        return splittedByNumber;
    }


    return (
            <div className="reminders__hometasks">
                {desktop && 
                    sorted.map((homework, index) => 
                        <Homework
                            setShowModal={setShowModal}
                            setHomework={setHomework}
                            setHomeworkDate={setHomeworkDate}
                            setHidePatchModal={setHidePatchModal}
                            key={homework._id}
                            name={homework.name}
                            id={homework._id}
                            lessonId={homework.lesson_id}
                            homework={homework}
                            setRefetchHomeworksBool={() => setRefetchHomeworksBool(!refetchHomeworksBool)}
                            refetchFiles={refetchFiles}
                            index={index}
                        />
                    )
                }
                {tablet &&
                    <Swiper
                        className="reminders__slider"
                        modules={[Pagination]}
                        pagination={{ clickable: true }}
                        slidesPerView={1}
                        spaceBetween={8}
                    >
                        {SplitByNumber(2).length !== 0 && SplitByNumber(2).map((homework, index) => 
                            <SwiperSlide
                                key={index}
                            >
                                <Homework
                                    setShowModal={setShowModal}
                                    setHomework={setHomework}
                                    setHomeworkDate={setHomeworkDate}
                                    setHidePatchModal={setHidePatchModal}
                                    key={homework[0]._id}
                                    name={homework[0].name}
                                    id={homework[0]._id}
                                    lessonId={homework[0].lesson_id}
                                    homework={homework[0]}
                                    setRefetchHomeworksBool={() => setRefetchHomeworksBool(!refetchHomeworksBool)}
                                    refetchFiles={refetchFiles}
                                    index={index}
                                />
                                {homework.length > 1 && 
                                    <Homework
                                        setShowModal={setShowModal}
                                        setHomework={setHomework}
                                        setHomeworkDate={setHomeworkDate}
                                        setHidePatchModal={setHidePatchModal}
                                        key={homework[1]._id}
                                        name={homework[1].name}
                                        id={homework[1]._id}
                                        lessonId={homework[1].lesson_id}
                                        homework={homework[1]}
                                        setRefetchHomeworksBool={() => setRefetchHomeworksBool(!refetchHomeworksBool)}
                                        refetchFiles={refetchFiles}
                                        index={index}
                                    />
                                }
                            </SwiperSlide>
                        )}
                    </Swiper>
                }
                {isMobile &&
                    <>
                        <div className="reminders__header">
                            <legend className="legend">
                                Домашние задания
                            </legend>
                            <div className="reminders__header-right">
                                <button
                                    className="btn-shape__add-item"
                                    // id="btnRemindersAdd"
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setShowDeadlines(false)
                                        setShowModal(true)
                                        setHideCreateModal(false)
                                    }}
                                >

                                </button>
                                <IconButton 
                                    icon={<ArchiveIcon width={18} height={18}/>} 
                                    onClick={() => {
                                        document.body.style.overflowY = "hidden";
                                        setShowDeadlines(false)
                                        setShowArchive(false)
                                    }}
                                />
                            </div>
                        </div>
                        {homeworks.length === 0 && isMobile
                            ? 
                            <div className="emptyList__title">Домашних заданий нет</div>
                            :
                            <Swiper
                            className="reminders__slider"
                            modules={[Pagination]}
                            pagination={{ clickable: true }}
                            slidesPerView={1}
                            spaceBetween={8}
                        >
                            {SplitByNumber(3).length !== 0 && SplitByNumber(3).map((homework, index) => 
                                <SwiperSlide
                                    key={index}
                                >
                                    <div className="reminders__card">
                                        <Homework
                                            setShowModal={setShowModal}
                                            setHomework={setHomework}
                                            setHomeworkDate={setHomeworkDate}
                                            setHidePatchModal={setHidePatchModal}
                                            key={homework[0]._id}
                                            name={homework[0].name}
                                            id={homework[0]._id}
                                            lessonId={homework[0].lesson_id}
                                            homework={homework[0]}
                                            setRefetchHomeworksBool={() => setRefetchHomeworksBool(!refetchHomeworksBool)}
                                            refetchFiles={refetchFiles}
                                            setShowDeadlines={setShowDeadlines}
                                            index={index}
                                        />
                                        {homework.length > 1 && 
                                            <Homework
                                                setShowModal={setShowModal}
                                                setHomework={setHomework}
                                                setHomeworkDate={setHomeworkDate}
                                                setHidePatchModal={setHidePatchModal}
                                                key={homework[1]._id}
                                                name={homework[1].name}
                                                id={homework[1]._id}
                                                lessonId={homework[1].lesson_id}
                                                homework={homework[1]}
                                                setRefetchHomeworksBool={() => setRefetchHomeworksBool(!refetchHomeworksBool)}
                                                refetchFiles={refetchFiles}
                                                setShowDeadlines={setShowDeadlines}
                                                index={index}
                                            />
                                        }
                                        {homework.length > 2 && 
                                            <Homework
                                                setShowModal={setShowModal}
                                                setHomework={setHomework}
                                                setHomeworkDate={setHomeworkDate}
                                                setHidePatchModal={setHidePatchModal}
                                                key={homework[2]._id}
                                                name={homework[2].name}
                                                id={homework[2]._id}
                                                lessonId={homework[2].lesson_id}
                                                homework={homework[2]}
                                                setRefetchHomeworksBool={() => setRefetchHomeworksBool(!refetchHomeworksBool)}
                                                refetchFiles={refetchFiles}
                                                setShowDeadlines={setShowDeadlines}
                                                index={index}
                                            />
                                        }
                                    </div>
                                </SwiperSlide>
                            )}
                        </Swiper>
                        }
                    </>
                }
            </div>
    );
};

export default Homeworks;
