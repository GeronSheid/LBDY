import "pages/MainPage/ui/sass/main.scss"
import {Homeworks} from "entities/Homeworks";
import {Deadlines} from "entities/Deadlines";
import {classNames} from "shared/lib/classNames";
import {useEffect, useMemo, useState} from "react";
import Scrollbar from "react-scrollbars-custom";
import "./HomeworksAndDeadlines.scss"
import {CreateHometasksModal} from "entities/CreateHomeworksModal";
import {CreateDeadlineModal} from "entities/CreateDeadlineModal";
import {ArchiveModal} from "entities/ArchiveModal";
import {DeadlineModalsContext} from "shared/contexts/DeadlineModalsContext";
import {DeleteModal} from "entities/DeleteModal";
import {DEADLINES, HOMEWORKS} from "shared/consts/consts";
import {RecoverModal} from "entities/RecoverModal";
import { PatchDeadlineModal } from "entities/PatchDeadlineModal";
import PatchHomeworksModal from "entities/PatchHomeworkModal/ui/PatchHomeworkModal";
import { IconButton } from "shared/ui/IconButton/ui/IconButton";
import ArchiveIcon from "shared/assets/img/archive-shaped.svg"
import useWindow from "shared/hooks/useWindow";
import { ModalWrapper } from "shared/ui/ModalWrapper";

const HomeworksAndDeadlines = ({homeworksModal, setHomeworksModal, refetchBool, setRefetchBool, isMobile=false}) => {
    const [thisDeadline, setThisDeadline] = useState()
    const [thisHomework, setThisHomework] = useState()
    const [homeworkDate, setHomeworkDate] = useState()
    const [showDeadlines, setshowDeadlines] = useState(JSON.parse(localStorage.getItem("showDeadlines")))
    
    const [hidePatchModal, setHidePatchModal] = useState(true)
    const [hideCreateModal, setHideCreateModal] = useState(true)
    const [hideArchiveModal, setHideArchiveModal] = useState(true)
    const [deleteOrRecoverInfo, setDeleteOrRecoverInfo] = useState({})
    const [isEmpty, setIsEmpty] = useState(false)
    const [refetchFiles, setRefetchFiles] = useState(false)
    
    const { windowWidth, windowHeight, orientation } = useWindow();
    const desktop = windowWidth > 1440 && windowHeight > 960;
    const tablet = !desktop && !isMobile;

    useEffect(() => {
        if (Object.entries(deleteOrRecoverInfo).length !== 0) {
            setHideArchiveModal(true)
        }
    }, [deleteOrRecoverInfo]);

    return (
        <>
            {!hideCreateModal && !showDeadlines &&
                <ModalWrapper>
                    <CreateHometasksModal
                        homeworks={homeworksModal}
                        setHomeworksModal={setHomeworksModal}
                        setHide={setHideCreateModal}
                        setHasUpdated={() => setRefetchBool(!refetchBool)}
                        isMobile={isMobile}
                    />
                </ModalWrapper>
            }
            {!hideCreateModal && showDeadlines &&
                <ModalWrapper>
                    <CreateDeadlineModal
                        deadline={homeworksModal}
                        setDeadline={setHomeworksModal}
                        setHide={setHideCreateModal}
                        setHasUpdated={() => setRefetchBool(!refetchBool)}
                        isMobile={isMobile}
                    />
                </ModalWrapper>
            }
            {!hidePatchModal && showDeadlines &&
                <ModalWrapper>
                    <PatchDeadlineModal 
                        thisDeadline={thisDeadline}
                        deadline={homeworksModal}
                        setDeadline={setHomeworksModal}
                        setHide={setHidePatchModal}
                        setHasUpdated={() => setRefetchBool(!refetchBool)}
                        isMobile={isMobile}
                    />
                </ModalWrapper>
            }
            {!hidePatchModal && !showDeadlines &&
                <ModalWrapper>
                    <PatchHomeworksModal
                        thisHomework={thisHomework}
                        thisHomeworkDate={homeworkDate}
                        setThisHomework={setThisHomework}
                        homeworks={homeworksModal}
                        setHomeworksModal={setHomeworksModal}
                        setHide={setHidePatchModal}
                        setHasUpdated={() => setRefetchBool(!refetchBool)}
                        setRefetchFiles={() => setRefetchFiles(!refetchFiles)}
                        isMobile={isMobile}
                    />
                </ModalWrapper>
            }
            {!hideArchiveModal &&
                <ModalWrapper>
                    <ArchiveModal
                        type={showDeadlines ? DEADLINES : HOMEWORKS}
                        showModal={homeworksModal}
                        setShowModal={setHomeworksModal}
                        setHide={setHideArchiveModal}
                        setHasUpdated={() => setRefetchBool(!refetchBool)}
                    />
                </ModalWrapper>
            }
            {Object.entries(deleteOrRecoverInfo).length !== 0
                && deleteOrRecoverInfo.type === "delete" &&
                <DeleteModal
                    type={!showDeadlines ? "дедлайн" : "домашнее задание"}
                    name={deleteOrRecoverInfo.name}
                    id={deleteOrRecoverInfo.id}
                    closeFunc={(e) => {e.preventDefault(); setDeleteOrRecoverInfo({}); setHomeworksModal(false)}}
                />
            }
            {Object.entries(deleteOrRecoverInfo).length !== 0
                && deleteOrRecoverInfo.type === "recover" &&
                    <RecoverModal
                        type={!showDeadlines ? "дедлайн" : "домашнее задание"}
                        name={deleteOrRecoverInfo.name}
                        id={deleteOrRecoverInfo.id}
                        closeFunc={(e) => {e.preventDefault(); setDeleteOrRecoverInfo({}); setHomeworksModal(false)}}
                    />
            }
            <div className="reminders">
                {!isMobile &&
                    <div className="reminders__header">
                        <div className="reminders__header-left">
                            <button
                                className={classNames("btn-text__tab_dark",
                                    {["btn-text__tab_dark_active"]: !showDeadlines},
                                    []
                                )}
                                onClick={() => {setshowDeadlines(false), localStorage.setItem("showDeadlines", false)}}
                                id="remindersHomeTasksBtn"
                                type="button"
                            >
                                {windowWidth < 1440 ? 'ДЗ' : 'Домашние задания'}
                            </button>
                            <button
                                className={classNames("btn-text__tab_dark",
                                    {["btn-text__tab_dark_active"]: showDeadlines},
                                    []
                                )}
                                onClick={() => {setshowDeadlines(true), localStorage.setItem("showDeadlines", true)}}
                                id="remindersDeadlinesBtn"
                                type="button"
                            >
                                Дедлайны
                            </button>
                        </div>
                        <div className="reminders__header-right">
                            <IconButton icon={<ArchiveIcon width={18} height={18}/>} onClick={() => {
                                    setHomeworksModal(true)
                                    setHideArchiveModal(false)
                                }}/>
                            <button
                                className="btn-shape__add-item"
                                id="btnRemindersAdd"
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault()
                                    setHomeworksModal(true)
                                    setHideCreateModal(false)
                                }}
                            >

                            </button>
                        </div>
                    </div>
                }
                {!isMobile && 
                    <>
                        {
                            !showDeadlines
                            ? 
                            isEmpty && <div className="emptyList__title">Домашних заданий нет</div>
                            :
                            isEmpty && <div className="emptyList__title">Дедлайнов нет</div>
                        }
                    </>
                }
                {
                    desktop && 
                    <Scrollbar
                        className="reminders__wrapper"
                        elementRef
                        disableTrackYWidthCompensation={true}
                        trackYProps={{style: {width: "4px", background: "transparent", marginRight: 5}}}
                        thumbYProps={{style: {background: "#687074", maxHeight: "62px", opacity: 0.5}}}
                    >   
                        <div className="reminders__container">
                        {!showDeadlines
                            ?
                            <Homeworks
                                setHidePatchModal={() => setHidePatchModal(false)}
                                setHomework={setThisHomework}
                                refetchBool={refetchBool}
                                setShowModal={setHomeworksModal}
                                setHomeworkDate={setHomeworkDate}
                                refetchFiles={refetchFiles}
                                isEmpty={setIsEmpty}
                            />
                            : 
                            <Deadlines 
                                setHidePatchModal={() => setHidePatchModal(false)}
                                refetchBool={refetchBool} 
                                setDeadline={setThisDeadline} 
                                setShowModal={setHomeworksModal}
                                isEmpty={setIsEmpty}
                            />
                        }
                        </div>
                    </Scrollbar>
                }
                {tablet && 
                    <div className="reminders__container">
                        {!showDeadlines
                            ?
                            <Homeworks
                                setHidePatchModal={() => setHidePatchModal(false)}
                                setHomework={setThisHomework}
                                refetchBool={refetchBool}
                                setShowModal={setHomeworksModal}
                                setHomeworkDate={setHomeworkDate}
                                refetchFiles={refetchFiles}
                                isEmpty={setIsEmpty}
                            />
                            : 
                            <Deadlines 
                                setHidePatchModal={() => setHidePatchModal(false)}
                                refetchBool={refetchBool} 
                                setDeadline={setThisDeadline} 
                                setShowModal={setHomeworksModal}
                                isEmpty={setIsEmpty}
                            />
                        }
                    </div>
                }
                {isMobile &&
                    <div className="reminders__container">
                        <Homeworks
                            setHidePatchModal={() => setHidePatchModal(false)}
                            setHomework={setThisHomework}
                            refetchBool={refetchBool}
                            setShowModal={setHomeworksModal}
                            setHomeworkDate={setHomeworkDate}
                            refetchFiles={refetchFiles}
                            isEmpty={setIsEmpty}
                            isMobile={isMobile}
                            setHideArchiveModal={setHideArchiveModal}
                            setHideCreateModal={setHideCreateModal}
                            hideCreateModal={hideCreateModal}
                            setShowDeadlines={setshowDeadlines}
                            setShowArchive={setHideArchiveModal}
                        />
                        <Deadlines 
                            setHidePatchModal={() => setHidePatchModal(false)}
                            refetchBool={refetchBool} 
                            setDeadline={setThisDeadline} 
                            setShowModal={setHomeworksModal}
                            isEmpty={setIsEmpty}
                            isMobile={isMobile}
                            setHideArchiveModal={setHideArchiveModal}
                            setHideCreateModal={setHideCreateModal}
                            hideCreateModal={hideCreateModal}
                            setShowDeadlines={setshowDeadlines}
                            setShowArchive={setHideArchiveModal}
                        />
                    </div>
                }
            </div>
        </>
    );
};

export default HomeworksAndDeadlines;
