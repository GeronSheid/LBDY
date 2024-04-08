import { MyProjects } from "entities/MyProjects";
import { useCallback, useEffect, useRef, useState } from "react";
import { classNames } from "shared/lib/classNames";
import "pages/MainPage/ui/sass/main.scss"
import { CreateProjectModal } from "entities/CreateProjectModal";
import useFetching from "shared/hooks/useFetching";
import TaskManagementApi from "shared/api/TaskManagmentApi";
import Scrollbar from "react-scrollbars-custom";
import { ArchiveModal } from "entities/ArchiveModal";
import { PROJECTS } from "shared/consts/consts";
import { IconButton } from "shared/ui/IconButton/ui/IconButton";
import ArchiveIcon from 'shared/assets/img/archive-shaped.svg'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import useWindow from "shared/hooks/useWindow";
import { MobileTab } from "shared/ui/MobileTab";
import { ModalWrapper } from "shared/ui/ModalWrapper";
import { CSSTransition } from 'react-transition-group';
import { GroupMembersModal } from "../../../entities/GroupMembersModal";

const Projects = ({ projectsModal, setProjectsModal, isMobile = false }) => {
    const [groupProjects, setGroupProjects] = useState(JSON.parse(localStorage.getItem("groupProjects")))
    const [hideCreateModal, setHideCreateModal] = useState(true)
    const [hideArchive, setHideArchive] = useState(true)
    const [projects, setProjects] = useState([])
    const [refetchBool, setRefetchBool] = useState(false)
    const [members, setMembers] = useState([])
    const [membersOpen, setMembersOpen] = useState(false)
    

    const { windowWidth, windowHeight, orientation } = useWindow();
    const desktop = windowWidth > 1440 && windowHeight > 960;
    const tablet = !desktop && !isMobile;

    const [getProjects] = useFetching(useCallback(async () => {
        if (!groupProjects) {
            return await TaskManagementApi.getMyProjects('active')
        } else {
            return await TaskManagementApi.getGroupProjects('active')
        }
    }, [groupProjects]))

    const handleMembers = (members, bool) => {
        setMembers(members)
        setMembersOpen(bool)
    }

    useEffect(() => {
        setProjects([])
        getProjects()
            .then(res => {
                if (!res || res.errors) return
                setProjects(res.data)
            })
    }, [refetchBool, groupProjects]);

    return (
        <>
            {/* <CSSTransition
                nodeRef={CreateProjectsRef}
                classNames='modalAnimation' 
                in={!hideCreateModal && projectsModal} 
                timeout={200}
                unmountOnExit
            >
                <ModalWrapper>
                    <CreateProjectModal
                        groupProjects={groupProjects} 
                        projectsModal={projectsModal} 
                        setRefetchBool={() => setRefetchBool(!refetchBool)}
                        setProjectsModal={setProjectsModal} 
                        setHide={setHideCreateModal}
                    />
                </ModalWrapper>
            </CSSTransition> */}
            {!hideCreateModal &&
                <ModalWrapper>
                    <CreateProjectModal
                        groupProjects={groupProjects}
                        projectsModal={projectsModal}
                        setRefetchBool={() => setRefetchBool(!refetchBool)}
                        setProjectsModal={setProjectsModal}
                        setHide={setHideCreateModal}
                        isMobile={isMobile}
                    />
                </ModalWrapper>
            }
            {!hideArchive && 
                <ModalWrapper>
                    <ArchiveModal
                        setHasUpdated={() => setRefetchBool(!refetchBool)} 
                        type={PROJECTS}
                        showModal={projectsModal} 
                        setShowModal={setProjectsModal} 
                        setHide={setHideArchive}
                    />
                </ModalWrapper>
            }
            {(membersOpen && members.length !== 0) &&
                <ModalWrapper>
                    <GroupMembersModal
                        users={members}
                        onClick={() => setMembersOpen(false)}
                    />
                </ModalWrapper>
            }
            {isMobile
                ?
                <div className="projects">
                    <div className="projects__header">
                        <legend className="legend">
                            Проекты
                        </legend>
                        <div className="reminders__header-right">
                            <button
                                className="btn-shape__add-item"
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault()
                                    setProjectsModal(true)
                                    setHideCreateModal(false)
                                }}
                            >

                            </button>
                            <IconButton
                                icon={<ArchiveIcon width={18} height={18} />}
                                onClick={() => {
                                    setProjectsModal(true)
                                    setHideArchive(false)
                                    document.body.style.overflowY = "hidden";
                                }}
                            />
                        </div>
                    </div>
                    <MobileTab
                        tab1={'Личные'}
                        tab2={'Групповые'}
                        checked={groupProjects}
                        setChecked={setGroupProjects}
                    />
                    <div className="projects__list">
                        {!groupProjects && !projects.length && <div className="emptyList__title">Моих проектов нет</div>}
                        {groupProjects && !projects.length && <div className="emptyList__title">Групповых проектов нет</div>}
                        <Swiper className="projects-swiper"
                            modules={[Pagination]}
                            pagination={{ clickable: true }}
                            slidesPerView={1}
                            spaceBetween={24}
                        >
                            {!groupProjects && projects.length !== 0 &&
                                projects.map(project => {
                                    const startDate = new Date(project.date)
                                    return (
                                        <SwiperSlide
                                            key={project._id}
                                        >
                                            <MyProjects
                                                isMobile={isMobile}
                                                thisProject={project}
                                                name={project.name}
                                                startDate={startDate.toLocaleDateString('ru-RU')}
                                                projectId={project._id}
                                            />
                                        </SwiperSlide>
                                    )
                                })
                            }
                            {groupProjects && projects.map(project => {
                                const startDate = new Date(project.date)
                                return (
                                    <SwiperSlide
                                        key={project._id}
                                    >
                                        <MyProjects
                                            isMobile={isMobile}
                                            groupProject={groupProjects}
                                            thisProject={project}
                                            name={project.name}
                                            startDate={startDate.toLocaleDateString('ru-RU')}
                                            projectId={project._id}
                                            handleMembers={handleMembers}
                                        />
                                    </SwiperSlide>
                                )
                            })
                            }
                        </Swiper>
                    </div>
                </div>
                :
                <div className="projects">
                    <div className="projects__header">
                        <div className="projects__header-left">
                            <button
                                className={classNames("btn-text__tab_dark",
                                    { ["btn-text__tab_dark_active"]: !groupProjects },
                                    []
                                )}
                                onClick={() => { setGroupProjects(false), localStorage.setItem("groupProjects", false) }}
                                id="projectsCurrBtn"
                                type="button"
                            >
                                Проекты
                            </button>
                            <button
                                className={classNames("btn-text__tab_dark",
                                    { ["btn-text__tab_dark_active"]: groupProjects },
                                    []
                                )}
                                onClick={() => { setGroupProjects(true), localStorage.setItem("groupProjects", true) }}
                                id="projectsGroupBtn"
                                type="button"
                            >
                                Групповые
                            </button>
                        </div>
                        <div
                            className="projects__header-right"
                        >
                            <IconButton icon={<ArchiveIcon width={18} height={18} />} onClick={() => {
                                setProjectsModal(true)
                                setHideArchive(false)
                            }} />
                            <button
                                className="btn-shape__add-item"
                                id="btnProjectsAdd"
                                type="button"
                                onClick={() => {
                                    setProjectsModal(true)
                                    setHideCreateModal(false)
                                }}
                            >
                            </button>
                        </div>
                    </div>
                    {!groupProjects && !projects.length && <div className="emptyList__title">Моих проектов нет</div>}
                    {groupProjects && !projects.length && <div className="emptyList__title">Групповых проектов нет</div>}
                    {desktop &&
                        <Scrollbar
                            className="projects__wrapper"
                            elementRef
                            disableTrackYWidthCompensation={true}
                            trackYProps={{ style: { width: "4px", background: "transparent", marginRight: 5 } }}
                            thumbYProps={{ style: { background: "#687074", maxHeight: "62px", opacity: 0.5 } }}
                        >
                            <div className="projects__current" id="currentProjects">
                                {!groupProjects && projects.length !== 0 &&
                                    projects.map(project => {
                                        const startDate = new Date(project.date)
                                        return <MyProjects
                                            thisProject={project}
                                            key={project._id}
                                            name={project.name}
                                            startDate={startDate.toLocaleDateString('ru-RU')}
                                            projectId={project._id}
                                        />
                                    })
                                }
                                {groupProjects && projects.map(project => {
                                    const startDate = new Date(project.date)
                                    return <MyProjects
                                        groupProject={groupProjects}
                                        thisProject={project}
                                        key={project._id}
                                        name={project.name}
                                        startDate={startDate.toLocaleDateString('ru-RU')}
                                        projectId={project._id}
                                    />
                                })
                                }
                            </div>
                        </Scrollbar>
                    }
                    {tablet &&
                        <Swiper className="projects-swiper"
                            modules={[Pagination]}
                            pagination={{ clickable: true }}
                            slidesPerView={1}
                            spaceBetween={24}
                        >
                            {!groupProjects && projects.length !== 0 &&
                                projects.map(project => {
                                    const startDate = new Date(project.date)
                                    return (
                                        <SwiperSlide
                                            key={project._id}
                                        >
                                            <MyProjects
                                                thisProject={project}
                                                name={project.name}
                                                startDate={startDate.toLocaleDateString('ru-RU')}
                                                projectId={project._id}
                                            />
                                        </SwiperSlide>
                                    )
                                })
                            }
                            {groupProjects && projects.map(project => {
                                const startDate = new Date(project.date)
                                return (
                                    <SwiperSlide
                                        key={project._id}
                                    >
                                        <MyProjects
                                            groupProject={groupProjects}
                                            thisProject={project}
                                            name={project.name}
                                            startDate={startDate.toLocaleDateString('ru-RU')}
                                            projectId={project._id}
                                        />
                                    </SwiperSlide>
                                )
                            })
                            }
                        </Swiper>
                    }
                </div>
            }

        </>
    );
};

export default Projects;
