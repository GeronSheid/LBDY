import "./ProjectTaskMini.scss";
import {
  useCallback,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";
import useFetching from "shared/hooks/useFetching";
import TaskManagementApi from "shared/api/TaskManagmentApi";
import { Checkbox } from "shared/ui/Checkbox";
import gsap from "gsap";

const ProjectTaskMini = ({ task, handleFrontDone }) => {
  const [resizeBool, setResizeBool] = useState(false);
  const [goToDone, setGoToDone] = useState(false);
  const [updateTask, isLoadingUpdate] = useFetching(
    useCallback(async () => {
      return await TaskManagementApi.updateProjectTask(task._id, {
        ...task,
        done: !task.done,
      });
    }, [])
  );

  function setDone() {
    setGoToDone(true);
  }

  function handleDone() {
    updateTask().then((res) => {
      if (!res || res.errors) return;
      handleFrontDone(task._id, true);
    });
  }
  useLayoutEffect(() => {
    if (!goToDone) return;
    let line = document.getElementById(`pp${task._id}Line`);
    gsap.fromTo(
      line,
      { width: 1 },
      {
        visibility: "visible",
        width: window.innerWidth < 1132 ? "70%" : "85%",
        duration: 1,
        onComplete: handleDone,
      }
    );
  }, [goToDone]);

  return (
    <div className="projectTaskMini__wrapper">
      <span
        className="projectTaskMini__line-through"
        id={`pp${task._id}Line`}
      ></span>
      <div className="projectTaskMini__wrapperLeft">
        <div className="projectTaskMini__date">
          {task.date.split("-").reverse().join(".")}
        </div>
        <div className="projectTaskMini__name">{task.name}</div>
      </div>
      <form className="reminders-item__checkbox">
        <fieldset className="form__fieldset">
          <div className="field input__checkbox">
            <Checkbox
              idVar={task._id}
              handleClick={() => setDone()}
              defChecked={task.done}
              isDark={false}
            />
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default ProjectTaskMini;
