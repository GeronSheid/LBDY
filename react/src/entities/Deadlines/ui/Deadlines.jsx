
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import { Deadline } from "shared/ui/Deadline";
import { IconButton } from "shared/ui/IconButton";
import useFetching from "shared/hooks/useFetching";
import useWindow from "shared/hooks/useWindow";
import ArchiveIcon from "shared/assets/img/archive-shaped.svg";
import TaskManagementApi from "shared/api/TaskManagmentApi";

import "pages/MainPage/ui/sass/main.scss";


const Deadlines = ({ refetchBool,
    setHidePatchModal, 
    setDeadline, 
    setShowModal, 
    setHideCreateModal, 
    hideCreateModal, 
    setShowDeadlines, 
    isEmpty, 
    isMobile = false,
    setShowArchive
 }) => {
    const [deadlines, setDeadlines] = useState([])
    const [refetchDeadlinesBool, setRefetchdeadlinesBool] = useState(false)

    const { windowWidth, windowHeight, orientation } = useWindow();
    const desktop = windowWidth > 1440 && windowHeight > 960;
    const tablet = !desktop && !isMobile;

    const [getDeadlines] = useFetching(async () => {
        return await TaskManagementApi.getDeadlines('active')
    })
    useEffect(() => {
        getDeadlines()
            .then(res => {
                if (res.errors || !res) return
                let sorted = res.data.sort((a, b) => +(new Date(a.date).toLocaleDateString("ru-RU")).replaceAll(".", "") - +(new Date(b.date).toLocaleDateString("ru-RU")).replaceAll(".", ""))
                setDeadlines(sorted)
            })
    }, [refetchBool, refetchDeadlinesBool]);

    useEffect(() => {
        if (deadlines.length === 0) {
            isEmpty(true)
        } else {
            isEmpty(false)
        }
    }, [deadlines])

    const SplitByNumber = (number) => {
        let splittedByNumber = [];
        for (let i = 0; i < deadlines.length; i += number) {
            splittedByNumber.push(deadlines.slice(i, i + number));
        }
        return splittedByNumber;
    }

    return (
        <div className="reminders__deadlines">
            {desktop && deadlines.length !== 0 &&
                deadlines.map((deadline) =>
                    <Deadline
                        setShowModal={setShowModal}
                        setDeadline={setDeadline}
                        setHidePatchModal={setHidePatchModal}
                        key={deadline._id}
                        name={deadline.name}
                        date={deadline.date}
                        id={deadline._id}
                        deadline={deadline}
                        setRefetchdeadlinesBool={() => setRefetchdeadlinesBool(!refetchDeadlinesBool)}
                    />
                )
            }
            {tablet && deadlines.length !== 0 &&
                <Swiper
                    className="reminders__slider"
                    modules={[Pagination]}
                    pagination={{ clickable: true }}
                    slidesPerView={1}
                    spaceBetween={24}
                >
                    {SplitByNumber(2).length !== 0 &&
                        SplitByNumber(2).map((deadline, index) =>
                            <SwiperSlide
                                key={deadline[0]._id}
                            >
                                <Deadline
                                    setShowModal={setShowModal}
                                    setDeadline={setDeadline}
                                    setHidePatchModal={setHidePatchModal}
                                    name={deadline[0].name}
                                    date={deadline[0].date}
                                    id={deadline[0]._id}
                                    deadline={deadline[0]}
                                    setRefetchdeadlinesBool={() => setRefetchdeadlinesBool(!refetchDeadlinesBool)}
                                />
                                {deadline.length > 1 &&
                                    <Deadline
                                        setShowModal={setShowModal}
                                        setDeadline={setDeadline}
                                        setHidePatchModal={setHidePatchModal}
                                        name={deadline[1].name}
                                        date={deadline[1].date}
                                        id={deadline[1]._id}
                                        deadline={deadline[1]}
                                        setRefetchdeadlinesBool={() => setRefetchdeadlinesBool(!refetchDeadlinesBool)}
                                    />
                                }
                            </SwiperSlide>
                        )
                    }
                </Swiper>
            }
            {isMobile &&
                <>
                    <div className="reminders__header">
                        <legend className="legend">
                            Дедлайны
                        </legend>
                        <div className="reminders__header-right">
                            <button
                                className="btn-shape__add-item"
                                id="btnRemindersAdd"
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowDeadlines(true);
                                    setShowModal(true)
                                    setHideCreateModal(false);
                                }}
                            >

                            </button>
                            <IconButton
                                icon={<ArchiveIcon width={18} height={18} />}
                                onClick={() => {
                                    setShowDeadlines(true);
                                    setShowArchive(false);
                                    document.body.style.overflowY = "hidden";
                                }}
                            />
                        </div>
                    </div>
                    {deadlines.length === 0
                        ?
                        <div className="emptyList__title">Дедлайнов нет</div>
                        :
                        <Swiper
                        className="reminders__slider"
                        modules={[Pagination]}
                        pagination={{ clickable: true }}
                        slidesPerView={1}
                        spaceBetween={24}
                    >
                        {SplitByNumber(3).length !== 0 &&
                            SplitByNumber(3).map((deadline, index) =>
                                <SwiperSlide
                                    key={deadline[0]._id}
                                >
                                    <div className="reminders__card">
                                        <Deadline
                                            setShowModal={setShowModal}
                                            setDeadline={setDeadline}
                                            setHidePatchModal={setHidePatchModal}
                                            name={deadline[0].name}
                                            date={deadline[0].date}
                                            id={deadline[0]._id}
                                            deadline={deadline[0]}
                                            setShowDeadlines={setShowDeadlines}
                                            setRefetchdeadlinesBool={() => setRefetchdeadlinesBool(!refetchDeadlinesBool)}
                                        />
                                        {deadline.length > 1 &&
                                            <Deadline
                                                setShowModal={setShowModal}
                                                setDeadline={setDeadline}
                                                setHidePatchModal={setHidePatchModal}
                                                name={deadline[1].name}
                                                date={deadline[1].date}
                                                id={deadline[1]._id}
                                                deadline={deadline[1]}
                                                setShowDeadlines={setShowDeadlines}
                                                setRefetchdeadlinesBool={() => setRefetchdeadlinesBool(!refetchDeadlinesBool)}
                                            />
                                        }
                                        {deadline.length > 2 &&
                                            <Deadline
                                                setShowModal={setShowModal}
                                                setDeadline={setDeadline}
                                                setHidePatchModal={setHidePatchModal}
                                                name={deadline[2].name}
                                                date={deadline[2].date}
                                                id={deadline[2]._id}
                                                deadline={deadline[2]}
                                                setShowDeadlines={setShowDeadlines}
                                                setRefetchdeadlinesBool={() => setRefetchdeadlinesBool(!refetchDeadlinesBool)}
                                            />
                                        }
                                    </div>
                                </SwiperSlide>
                            )
                        }
                    </Swiper>
                    }
                </>
            }
        </div>
    );
};

export default Deadlines;
