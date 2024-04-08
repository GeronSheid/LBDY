import ProjectTask from "shared/ui/ProjectTask/ui/ProjectTask";
import ProjectTaskMini from "shared/ui/ProjectTaskMini/ui/ProjectTaskMini";
import "pages/ProjectPage/ui/ProjectPage.scss";
import "pages/MainPage/ui/sass/main.scss";
import { Link } from "react-router-dom";
import { MAIN_ROUTE } from "shared/consts/paths";
import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import useFetching from "shared/hooks/useFetching";
import TaskManagementApi from "shared/api/TaskManagmentApi";
import { DeleteProjectTaskModal } from "entities/DeleteProjectTaskModal";
import ProjectMediaModal from "entities/ProjectMediaModal/ui/ProjectMediaModal";
import ProjectLinksModal from "entities/ProjectLinksModal/ui/ProjectLinksModal";
import { CreateTaskModal } from "entities/CreateTaskModal";
import { Scrollbar } from "react-scrollbars-custom";
import { PatchProjectModal } from "entities/PatchProjectModal";
import { IconButton } from "shared/ui/IconButton";
import PatchIcon from "shared/assets/img/edit.svg";
import SmallArrow from "../../../shared/assets/img/smallArrow.svg";
import ArrowDown from "../../../shared/assets/img/select-arrow_light.svg";
import { ModalWrapper } from "shared/ui/ModalWrapper";
import { Tooltip } from "react-tooltip";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import { DeleteModal } from "entities/DeleteModal";
import useWindow from "shared/hooks/useWindow";
import PrevItem from "../../../shared/assets/img/previous-item.svg"
import Arrow from "shared/assets/img/smallArrow.svg";
import { GroupMembersModal } from "entities/GroupMembersModal";

const ProjectPage = () => {
  const location = useLocation();
  const { thisProject, groupProject } = location.state;
  const { name, description, project_id } = thisProject;
  const { windowWidth, windowHeight, orientation } = useWindow();
  const isMobile = windowWidth <= 1024 || windowHeight <= 600;


  const [opacity, setOpasity] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteUnitModalOpen, setDeleteUnitModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [patchModalOpen, setPatchModalOpen] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [linksModalOpen, setLinksModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [refetchBool, setRefetchBoool] = useState(false);
  const [doneTasks, setDoneTasks] = useState(0);
  const [isLongDescription, setLongDescription] = useState(false);
  const [isOverflowed, setOverfowed] = useState(false);
  const [users, setUsers] = useState(thisProject.users);
  const [membersOpen, setMembersOpen] = useState(false)

  const descriptionRef = useRef();
  const [getTasks] = useFetching(async () => {
    return await TaskManagementApi.getProjectTasks(project_id);
  });

  function refetch() {
    setRefetchBoool(!refetchBool);
  }

  function checkOverflow(el) {

    setOverfowed(el.scrollHeight > el.offsetHeight + 5);
  }
  useEffect(() => {
    checkOverflow(descriptionRef.current);
  }, [description]);

  useEffect(() => {
    getTasks().then((res) => {
      if (!res || res.errors) return;
      setTasks(res.data);
      let doneTasks = res.data.filter((task) => task.done);
      setDoneTasks(doneTasks.length);
    });
  }, [refetchBool]);

  function handleFrontDone(id, bool) {
    let newTasks = [...tasks];
    let index = tasks.findIndex((task) => task._id === id);
    newTasks[index].done = bool;
    let doneTasks = newTasks.filter((task) => task.done);
    setTasks(newTasks);
    setDoneTasks(doneTasks.length);
  }



  return (
    <div className="main-container main-container_project">
      {opacity && (
        <ModalWrapper>
          {mediaModalOpen && (
            <ProjectMediaModal
              project_id={project_id}
              setOpasity={setOpasity}
              closeModal={() => setMediaModalOpen(false)}
              isMobile={isMobile}
            />
          )}
          {linksModalOpen && (
            <ProjectLinksModal
              project_id={project_id}
              setOpasity={setOpasity}
              closeModal={() => setLinksModalOpen(false)}
              isMobile={isMobile}
            />
          )}
          {patchModalOpen && (
            <PatchProjectModal
              setRefetchBool={refetch}
              isGroup={groupProject}
              thisProject={thisProject}
              projectsModal={patchModalOpen}
              setProjectsModal={setPatchModalOpen}
              setHide={setOpasity}
              setUsers={setUsers}
              isMobile={isMobile}
            />
          )}
          {createModalOpen && (
            <CreateTaskModal
              method="POST"
              refetch={refetch}
              createModalOpen={createModalOpen}
              setCreateModalOpen={setCreateModalOpen}
              setHide={setOpasity}
              projectId={project_id}
              users={users}
              isMobile={isMobile}
            />
          )}
          {deleteModalOpen && (
            <DeleteProjectTaskModal
              entity={thisProject}
              setOpasity={setOpasity}
              setDeleteModalOpen={() => setDeleteModalOpen(false)}
              isMobile={isMobile}
              type="project"
            />
          )}
          {deleteUnitModalOpen && <DeleteModal isMobile={isMobile} />}
          {membersOpen && 
            <ModalWrapper>
              <GroupMembersModal
                  users={users}
                  onClick={() => {setMembersOpen(false); setOpasity(false);}}
              />
          </ModalWrapper>
          }
        </ModalWrapper>
      )}
      <div className="projectPage__header">
        <Link className="projectPage__backButton" to={MAIN_ROUTE}>
          {isMobile ? <PrevItem /> : "Назад"}
        </Link>
        {isMobile &&
          <div className="projectPage__buttonBar">
            <button
              className="btn-shape__add-item"
              id="btnProjectsAdd"
              type="button"
              onClick={() => {
                setOpasity(true);
                setCreateModalOpen(true);
              }}
            ></button>
            <IconButton
              icon={<PatchIcon width={24} height={24} fill={"#fff"} />}
              onClick={() => {
                setPatchModalOpen(true);
                setOpasity(true);
              }}
            />
          </div>
        }
      </div>
      <div className="projectPage__leftSide">
        <div className="projectPage__projectWindow">
          <div className="projectPage__projectWindow__upper">
            <div className="projectPage__titleRow">
              <div className="projectPage__title">{name}</div>
              {!isMobile &&
                <div className="projectPage__buttonBar">
                  <button
                    className="btn-shape__add-item"
                    id="btnProjectsAdd"
                    type="button"
                    onClick={() => {
                      setOpasity(true);
                      setCreateModalOpen(true);
                    }}
                  ></button>
                  <IconButton
                    icon={<PatchIcon width={24} height={24} fill={"#fff"} />}
                    onClick={() => {
                      setPatchModalOpen(true);
                      setOpasity(true);
                    }}
                  />
                </div>
              }
            </div>
            <div
              ref={descriptionRef}
              onClick={() => isOverflowed && setLongDescription(!isLongDescription)}
              className={
                isLongDescription
                  ? "projectPage__subTitle-open"
                  : "projectPage__subTitle"
              }
              style={{
                cursor: isLongDescription || isOverflowed ? "pointer" : "default",
              }}
            >
              {description}
              {isOverflowed && (
                <div
                  className={
                    isLongDescription
                      ? "projectPage__openArrow-up"
                      : "projectPage__openArrow-down"
                  }
                  onClick={() => setLongDescription(!isLongDescription)}
                >
                  <ArrowDown className="projectPage__openArrow" />
                </div>
              )}
            </div>
            {!isMobile ? <div className="projectPage__teamWrapper">
              {users.map((user) => (
                <div className="projectPage__teamUser">
                  <Link
                    key={user.id}
                    to={`https://t.me/${user.tg_username}`}
                    target="_blank"
                    data-tooltip-id={`user-tooltip-${user.id}`}
                  >
                    <img
                      className="projectPage__userAvatar"
                      src={user.avatars.small}
                      alt={user.name}
                    />
                  </Link>
                  <Tooltip
                    id={`user-tooltip-${user.id}`}
                    place="bottom-start"
                    offset={5}
                    key={user.id}
                    className="tooltip__body"
                  >
                    {user.first_name + " " + user.middle_name[0] + "."}
                  </Tooltip>
                </div>
              ))}
            </div>
              :
              <div className="projectPage__mobileMenu">
                <div className="projectPage__mobileMenu__item" onClick={() => {setOpasity(true); setMembersOpen(true)}}>
                  <button className="projectPage__mobileMenu__button" >Участники</button>
                  <Arrow />
                </div>
                <div className="projectPage__mobileMenu__item"
                  onClick={() => { setMediaModalOpen(true), setOpasity(true); }}
                >
                  <button className="projectPage__mobileMenu__button" >
                    Файлы
                  </button>
                  <Arrow />
                </div>
                <div className="projectPage__mobileMenu__item"
                  onClick={() => { setLinksModalOpen(true), setOpasity(true); }}
                >
                  <button className="projectPage__mobileMenu__button" >Ссылки</button>
                  <Arrow />
                </div>
              </div>
            }
          </div>
          {!isMobile && <div className="projectPage__throwLine"></div>}
          <div className="projectPage__projectWindow__downer">
            {isMobile
              ?
              <div className="projectPage__taskWrap">
                  {tasks.length > 0 ?
                    tasks
                      .sort((a, b) => {
                        return (
                          new Date(b.created_at).getTime() -
                          new Date(a.created_at).getTime()
                        );
                      })
                      .map((task) => (
                        <ProjectTask
                          handleFrontDone={handleFrontDone}
                          setDoneTasks={setDoneTasks}
                          doneTasks={doneTasks}
                          refetch={refetch}
                          users={users}
                          setOpasity={setOpasity}
                          opasity={opacity}
                          key={task._id}
                          task={task}
                          isMobile={isMobile}
                        />
                      ))
                    :
                    <div className="emptyList__title_noBorder">Задач нет</div>
                  }
              </div>
              :
              <>
                {tasks.length === 0 ? (
                  <div className="emptyList__title">Задач нет</div>
                )
                  :
                  (
                    <Scrollbar
                      className="projectTask__list"
                      elementRef
                      disableTrackYWidthCompensation={true}
                      trackYProps={{
                        style: {
                          width: "4px",
                          background: "transparent",
                          marginRight: 4,
                        },
                      }}
                      thumbYProps={{
                        style: {
                          background: "#979797",
                          minHeight: "50px",
                          maxHeight: "50px",
                          opacity: 0.5,
                          color: "white",
                        },
                      }}
                      trackXProps={{
                        style: {
                          width: "4px",
                          background: "transparent",
                          marginRight: 5,
                        },
                      }}
                      thumbXProps={{
                        style: { background: "#687074", maxHeight: "100%", opacity: 0 },
                      }}
                    >
                      {tasks
                        .sort((a, b) => {
                          return (
                            new Date(b.created_at).getTime() -
                            new Date(a.created_at).getTime()
                          );
                        })
                        .map((task) => (
                          <ProjectTask
                            handleFrontDone={handleFrontDone}
                            setDoneTasks={setDoneTasks}
                            doneTasks={doneTasks}
                            refetch={refetch}
                            users={users}
                            setOpasity={setOpasity}
                            opasity={opacity}
                            key={task._id}
                            task={task}
                          />
                        ))}
                    </Scrollbar>
                  )}
              </>
            }


          </div>
        </div>
      </div>
      <div className="projectPage__rightSide">
        <div className="projectPage__about">
          <div className="projectPage__aboutTitle">О проекте</div>
          <div className="projectPage__progressWrapper">
            <div className="projectPage__progressText">Прогресс</div>
            <div className="projectPage__progressText">{`${tasks.length ? Math.floor((doneTasks / tasks.length) * 100) : 0
              }%`}</div>
          </div>
          <div className="projectPage__doneWrapper">
            <div
              className="projectPage__doneLine"
              style={{
                width: `${tasks.length ? (doneTasks / tasks.length) * 100 : 0
                  }%`,
              }}
            ></div>
          </div>
          <div className="projectPage__tasks">
            {tasks.filter((task) => !task.done).length
              ? "Ближайшие задачи:"
              : "Активных задач нет"}
          </div>
          <Scrollbar
            style={{ height: "180px" }}
            elementRef
            disableTrackYWidthCompensation={true}
            trackYProps={{
              style: {
                width: "4px",
                background: "transparent",
                marginRight: -8,
              },
            }}
            thumbYProps={{
              style: {
                background: "#979797",
                minHeight: "50px",
                maxHeight: "50px",
                opacity: 0.5,
                color: "white",
              },
            }}
            trackXProps={{
              style: {
                width: "4px",
                background: "transparent",
                marginRight: 5,
              },
            }}
            thumbXProps={{
              style: { background: "#687074", maxHeight: "100%", opacity: 0 },
            }}
            className="projectPage__tasksWrapper"
          >
            {tasks
              .sort(
                (a, b) =>
                  Number(a.date.replaceAll("-", "")) -
                  Number(b.date.replaceAll("-", ""))
              )
              .filter((task) => !task.done)
              .map((task, index) => (
                <ProjectTaskMini
                  handleFrontDone={handleFrontDone}
                  key={task._id}
                  task={task}
                />
              ))}
          </Scrollbar>
        </div>
        {!isMobile &&
          <button
            className="projectPage__button"
            onClick={() => {
              setMediaModalOpen(true), setOpasity(true);
            }}
          >
            <div className="projectPage__buttonText">Файлы</div>
            <SmallArrow />
          </button>}
        {!isMobile &&
          <button
            className="projectPage__button"
            onClick={() => {
              setLinksModalOpen(true), setOpasity(true);
            }}
          >
            <div className="projectPage__buttonText">Ссылки</div>
            <SmallArrow />
          </button>}
        <button
          className="projectPage__GetDone"
          onClick={() => {
            setDeleteModalOpen(true), setOpasity(true);
          }}
        >
          Архивировать проект
        </button>
      </div>
    </div>
  );
};

export default ProjectPage;

