import useFetching from "shared/hooks/useFetching";
import { useCallback, useEffect } from "react";
import TaskManagementApi from "shared/api/TaskManagmentApi";
import { Link } from "react-router-dom";
import { PROJECT } from "shared/consts/paths";
import { useState } from "react";
import { Tooltip } from 'react-tooltip'
import { ModalWrapper } from "shared/ui/ModalWrapper";
import GroupListModal from "../../GroupListModal/ui/GroupListModal";
import MyTeamUser from "../../MyTeamUser/ui/MyTeamUser";




const MyProjects = ({ name, startDate, projectId, thisProject, groupProject, isMobile = false, handleMembers }) => {

    const [tasks, setTasks] = useState([])
    const [doneTasks, setDoneTasks] = useState(0)

    const [getTasks] = useFetching(async () => {
        return await TaskManagementApi.getProjectTasks(thisProject.project_id)
    })

    useEffect(() => {
        getTasks()
            .then(res => {
                if (!res || res.errors) return
                setTasks(res.data)
                let doneTasks = res.data.filter(task => task.done)
                setDoneTasks(doneTasks.length)
            })
    }, [])

    return (
        <>
            <div className="projects-item projects-item_btn" >
                <Link className="projects-item__linkWrap" to={PROJECT} state={{ thisProject, groupProject }}>
                    <div className="projects-item__name" >
                        {name}
                    </div>
                    {isMobile &&
                        <span className="projects-item__date-range">
                            {`${startDate}`}
                        </span>
                    }
                    <div className="projects-item__info">
                        {!isMobile &&
                            <span className="projects-item__date-range">
                                {`${startDate}`}
                            </span>
                        }
                        <div className="projects-item__progress">
                            <span className="projects-item__progress-tasks">
                                {`${doneTasks} / ${tasks.length}`}
                            </span>
                            {!isMobile &&
                                <svg
                                    className="projects-item__progress-divider"
                                    width="4" height="4"
                                    viewBox="0 0 4 4"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle id="Ellipse 9" opacity="0.65" cx="2" cy="2" r="2" />
                                </svg>
                            }
                            <span className="projects-item__progress-percent">{`${tasks.length ? Math.floor(doneTasks / tasks.length * 100) : 0}%`}</span>
                        </div>
                    </div>
                    <div className="projectPage__doneWrapper">
                        <div className="projectPage__doneLine" style={{ width: `${tasks.length ? (doneTasks / tasks.length * 100) : 0}%` }}></div>
                    </div>
                </Link>
                {groupProject && isMobile &&
                    <button className="btn-text__fork projects-item__membersBtn" onClick={() => handleMembers(thisProject.users, true)}>
                        Участники
                    </button>
                }
                {groupProject && !isMobile &&
                    <div className="projects-item__usersBar">
                        {thisProject.users.map(user => {
                            return (
                                <Link
                                    key={`user-link-${user.id}_project-${thisProject._id}`}
                                    className="projects-item__user"
                                    to={`https://t.me/${user.tg_username}`}
                                    target="_blank"
                                    data-tooltip-id={`user-tooltip-${user.id}`}
                                >
                                    <img className="projects-item__image" src={user.avatars.small} alt={user.name} />
                                </Link>
                            )
                        })}
                    </div>
                }
            </div>
            {thisProject.users.map(user => (
                <Tooltip
                    id={`user-tooltip-${user.id}`}
                    place='bottom-start'
                    offset={5}
                    key={`user-tooltip-${user.id}_project-${thisProject._id}`}
                >
                    {user.first_name + " " + user.middle_name[0] + "."}
                </Tooltip>
            ))}
        </>
    );
};

export default MyProjects;
