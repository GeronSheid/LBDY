import "pages/MainPage/ui/sass/main.scss";
import "./ProjectTask.scss";
import { useState, useCallback, useLayoutEffect, useEffect } from "react";
import TaskComments from "shared/ui/TaskComment/ui/TaskComments";
import { DeleteProjectTaskModal } from "entities/DeleteProjectTaskModal";
import CreateTaskModal from "entities/CreateTaskModal/ui/CreateTaskModal";
import TaskManagementApi from "shared/api/TaskManagmentApi";
import useFetching from "shared/hooks/useFetching";
import { Checkbox } from "shared/ui/Checkbox";
import { ModalWrapper } from "shared/ui/ModalWrapper";
import { Tooltip } from "react-tooltip";
import useWindow from "shared/hooks/useWindow";
import TaskRedact from "shared/assets/img/taskRedact.svg"
import TaskDelete from "shared/assets/img/taskDelete.svg"
import TaskCommentsImg from "shared/assets/img/taskComments.svg"



const ProjectTask = ({
  doneTasks,
  handleFrontDone,
  setDoneTasks,
  refetch,
  task,
  users
}) => {

  const { windowWidth, windowHeight, orientation } = useWindow();
  const isMobile = windowWidth < 1025 || windowHeight <= 600;


  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [done, setDone] = useState(task.done);
  const [comments, setComments] = useState([]);
  const [opasity, setOpasity] = useState(false);

  const [updateTask, isLoadingUpdate] = useFetching(
    useCallback(async () => {
      return await TaskManagementApi.updateProjectTask(task._id, {
        ...task,
        done: !task.done,
      });
    }, [done])
  );
  const [getComments] = useFetching(
    useCallback(async () => {
      return await TaskManagementApi.getCommentsList(task._id);
    }, [])
  );

  useEffect(() => {
    getComments().then((res) => {
      if (!res.errors) {
        if (!res || res.errors) return;
        setComments(res.data);
      }
    });
  }, [task]);

  function handleDone() {
    if (!task.done) {
      updateTask().then((res) => {
        if (!res.error) {
          setDone(true);
          setDoneTasks(doneTasks + 1);
          handleFrontDone(task._id, true);
        }
      });
    } else {
      updateTask().then((res) => {
        if (!res.error) {
          setDone(false);
          setDoneTasks(doneTasks - 1);
          handleFrontDone(task._id, false);
        }
      });
    }
  }

  function getUser(users, user_id) {
    for (const user of users) {
      if (user.id === user_id) {
        return user;
      }
    }

    return {
      id: 0,
      avatars: {
        small: "https://s3-storage.lbdy.ru/avatars/0_small.jpg",
      },
      first_name: "Пользователь",
      middle_name: "",
    };
  }

  const user = getUser(users, task.user_id);

  return (
    <div>
      {opasity && (
        <ModalWrapper>
          {deleteModalOpen && (
            <DeleteProjectTaskModal
              refetch={refetch}
              entity={task}
              type={"task"}
              setOpasity={setOpasity}
              setDeleteModalOpen={() => setDeleteModalOpen(false)}
            />
          )}
          {updateModalOpen && (
            <CreateTaskModal
              method="PUT"
              task={task}
              refetch={refetch}
              createModalOpen={updateModalOpen}
              setCreateModalOpen={setUpdateModalOpen}
              setHide={setOpasity}
              users={users}
              isMobile={isMobile}
            />
          )}
        </ModalWrapper>
      )}
      <div className="projectTask__wrapper">
        <img
          style={task.done ? { opacity: "0.5" } : { opacity: "1" }}
          className="projectTask__person"
          src={user.avatars.small}
          alt="user"
          height={24}
          width={24}
          data-tooltip-id={`user-tooltip-${user.id}`}
        />
        <Tooltip
          id={`user-tooltip-${user.id}`}
          place="bottom-start"
          offset={5}
          key={user.id}
        >
          {user.first_name + " " + (user.middle_name !== "" ? (user.middle_name[0] + ".") : "")}
        </Tooltip>
        <div className="projectTask__info">
          <div
            className="projectTask__title"
            style={task.done ? { opacity: "0.5" } : { opacity: "1" }}
          >
            {task.name}
          </div>
          <div className="projectTask__description">{task.description}</div>
          <div
            className="projectTask__dates"
            style={task.done ? { opacity: "0.5" } : { opacity: "1" }}
          >
            {`${task.date.replaceAll("-", ".").split(".").reverse().join(".")}`}
          </div>
          <div className="projectTask__buttonRow">
            <button
              className="greenButton"
              onClick={() => setShowComments(!showComments)}
            >
              {isMobile ? <TaskCommentsImg /> : `Комментарии (${comments.length})`}
            </button>
            <button
              style={task.done ? { opacity: "0.5" } : { opacity: "1" }}
              className={!done ? "greyButton-active" : "greyButton"}
              onClick={() => {
                setUpdateModalOpen(true), setOpasity(true);
              }}
              disabled={done ? true : false}
            >
              {isMobile ? <TaskRedact/> : "Редактировать"}
            </button>
            <button
              className="greyButton-active"
              onClick={() => {
                setDeleteModalOpen(true), setOpasity(true);
              }}
            >
              {isMobile ? <TaskDelete /> : "Удалить"}
            </button>
          </div>
        </div>
        <form className="reminders-item__checkbox">
          <fieldset className="form__fieldset">
            <div className="field input__checkbox">
              <Checkbox
                idVar={task._id}
                handleClick={handleDone}
                defChecked={task.done}
                isDark={true}
              />
            </div>
          </fieldset>
        </form>
      </div>
      {
        <TaskComments
          users={users}
          setComments={setComments}
          task={task}
          showComments={showComments}
        />
      }
    </div>
  );
};

export default ProjectTask;
