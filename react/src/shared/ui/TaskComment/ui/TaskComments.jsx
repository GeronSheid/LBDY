import { useState, useCallback, useEffect, useRef } from "react";
import useFetching from "shared/hooks/useFetching";
import TaskManagementApi from "shared/api/TaskManagmentApi";
import CommentItem from "shared/ui/CommentItem/ui/CommntItem";
import "./TaskComments.scss";
import { Input } from "shared/ui/Input";
import { Scrollbar } from "react-scrollbars-custom";
import SmallArrow from "shared/assets/img/smallArrow.svg";

const TaskComments = ({ users, setComments, task, showComments }) => {
  const [commentsList, setCommentsList] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [refetchBool, setRefetchBool] = useState(false);
  const [startValidation, setStartValidation] = useState(false);

  const [getComments] = useFetching(
    useCallback(async () => {
      return await TaskManagementApi.getCommentsList(task._id);
    }, [])
  );
  const [createComment] = useFetching(
    useCallback(async () => {
      return await TaskManagementApi.createComment({
        project_task_comment: {
          message: newComment,
          project_task_id: task._id,
        },
      });
    })
  );

  useEffect(() => {
    getComments().then((res) => {
      if (!res || res.errors) return;
      setCommentsList(res.data);
      setComments(res.data);
    });
  }, [refetchBool]);

  function handleKeyPress(event) {
    if (!newComment) setStartValidation(true);
    else {
      if (event.key === "Enter") {
        createComment().then((res) => {
          setNewComment("");
          setRefetchBool(!refetchBool);
          setStartValidation(false);
        });
      }
    }
  }

  function handleSubmit() {
    if (!newComment) setStartValidation(true);
    else {
      createComment().then((res) => {
        setNewComment("");
        setRefetchBool(!refetchBool);
        setStartValidation(false);
      });
    }
  }

  return (
    <div
      className={
        showComments
          ? "taskComments__commentsWrapper-open"
          : "taskComments__commentsWrapper"
      }
    >
      <Scrollbar
        style={{ height: "140px" }}
        trackYProps={{
          style: { width: "4px", background: "transparent", marginRight: 4 },
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
          style: { width: "4px", background: "transparent", marginRight: 5 },
        }}
        thumbXProps={{
          style: { background: "#687074", maxHeight: "100%", opacity: 0.5 },
        }}
        className="taskComments__commentslist"
      >
        {commentsList
          .sort((a, b) => {
            if (a.created_at < b.created_at) return 1;
            if (a.created_at > b.created_at) return -1;
            return 0;
          })
          .map((comment) => (
            <CommentItem users={users} key={comment._id} comment={comment} />
          ))}
      </Scrollbar>
      <div className="taskComments__inputWrapper">
        <Input
          onKeyDown={(e) => handleKeyPress(e)}
          placeholder="Оставить комментарий"
          className="taskComments__input"
          onBlur={() => setStartValidation(false)}
          type="text"
          value={newComment}
          setValue={(e) => setNewComment(e.target.value)}
          disabled={task.done ? true : false}
        />
        <SmallArrow
          className={
            task.done
              ? "taskComments__inputArrow_disabled"
              : "taskComments__inputArrow"
          }
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};
export default TaskComments;
