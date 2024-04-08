import "pages/MainPage/ui/sass/main.scss"
import {useEffect, useLayoutEffect, useState} from "react";
import {gsap} from "gsap";
import useFetching from "shared/hooks/useFetching";
import TaskManagementApi from "shared/api/TaskManagmentApi";
import {ArchivedDeadline} from "shared/ui/ArchivedDeadline";
import {DEADLINES, HOMEWORKS, PROJECTS} from "shared/consts/consts";
import { ArchivedHomework } from "shared/ui/ArchivedHomework";
import { ArchivedProject } from "shared/ui/ArchivedProject";
import { Scrollbar } from "react-scrollbars-custom";
import useWindow from "shared/hooks/useWindow";

const ArchiveModal = ({
    type,
    showModal,
    setShowModal,
    setHide,
    setHasUpdated
}) => {
    const [getArchivedDeadlines] = useFetching(async () => {
        return await TaskManagementApi.getDeadlines("archived")
    })
    const [getArchivedHomeTasks] = useFetching(async () => {
        return await TaskManagementApi.getHomeTasks("archived")
    })
    const [getMyArchivedProjects] = useFetching(async () => {
        return await TaskManagementApi.getMyProjects("archived")
    })
    const [getGroupArchivedProjects] = useFetching(async () => {
        return await TaskManagementApi.getGroupProjects("archived")
    })
    const [archivedValue, setArchivedValue] = useState([])
    const [isUpdated, setUpdated] = useState(false)
    const [opasity, setOpasity] = useState(false)
    const { windowWidth, windowHeight, orientation } = useWindow();
    const isMobile = windowWidth <= 1024 || windowHeight <= 600; 

    useEffect(() => {
        if (type === DEADLINES) {
            getArchivedDeadlines()
                .then(res => {
                    if (res.errors || !res) return
                    setArchivedValue(res.data)
                })
        } else if (type === HOMEWORKS) {
            getArchivedHomeTasks()
                .then(res => {
                    if (res.errors || !res) return
                    setArchivedValue(res.data)
                    
                })
        } else if (type === PROJECTS) {
            getMyArchivedProjects()
                .then(res => {
                    if (res.errors || !res) return
                    setArchivedValue(res.data)
                })
            getGroupArchivedProjects()
                .then(res => {
                    if (res.errors || !res) return
                    setArchivedValue([...archivedValue, ...res.data])
                })
        }
    }, [isUpdated]);

    return (
        <div className="modal-hometasks-archived">
            <legend className="legend">Архив</legend>
            <button
                className="btn-text__close-modal_dark"
                id="closeModalHomeTasksArchive"
                onClick={() => {
                    setShowModal(false);
                    setHasUpdated(); 
                    setHide(true);
                    if (isMobile) document.body.style.overflowY = "auto";
                }}
            >
                Закрыть
            </button>
            <div className="archivedEntityList">
                <Scrollbar
                    style={archivedValue.length === 0 ? {height: '0'} : {height: 'calc(70dvh - 180px)'}}
                    disableTrackYWidthCompensation={true}
                    trackYProps={{style: {width: "4px", background: "transparent", marginRight: 5}}}
                    thumbYProps={{style: {background: "#687074", maxHeight: "62px", opacity: 0.5}}}
                >
                {type === DEADLINES &&
                    archivedValue.map((archivedDeadline, index) => (
                        <ArchivedDeadline
                            setOpasity={setOpasity}
                            key={archivedDeadline.name}
                            name={archivedDeadline.name}
                            date={archivedDeadline.date}
                            id={archivedDeadline._id}
                            setUpdated={() => setUpdated(!isUpdated)}
                    />
                    ))
                }
                {type === HOMEWORKS &&
                    archivedValue.map((archivedHomework, index) => (
                        <ArchivedHomework
                            setOpasity={setOpasity}
                            key={archivedHomework._id}
                            name={archivedHomework.name}
                            id={archivedHomework._id}
                            lessonId={archivedHomework.lesson_id}
                            setUpdated={() => setUpdated(!isUpdated)}
                        />
                    )) 
                }
                {type === PROJECTS &&
                    archivedValue.map((archivedProject, index) => (
                        <ArchivedProject
                            date={archivedProject.date}
                            setOpasity={setOpasity}
                            key={archivedProject.name}
                            name={archivedProject.name}
                            id={archivedProject._id}
                            lessonId={archivedProject.lesson_id}
                            setUpdated={() => setUpdated(!isUpdated)}
                        />
                    )) 
                }
                </Scrollbar>
            </div>
            {archivedValue.length === 0 &&
                <div className="projects__current" id="currentProjects">
                    <span className="projects__empty">
                        {`Нет ${type} в архиве`}
                    </span>
                </div>
            }
        </div>
    );
};

export default ArchiveModal;
