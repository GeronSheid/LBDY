import useFetching from "shared/hooks/useFetching";
import TaskManagementApi from "shared/api/TaskManagmentApi";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MAIN_ROUTE } from "shared/consts/paths";
import Spiner from "../../../shared/assets/img/spinner.svg"


const DeleteProjectTaskModal = ({
    refetch, entity, setDeleteModalOpen, setOpasity, type
}) => {

    const navigate = useNavigate()
    
    const [deleteTask, isLoadingDelete] = useFetching(async () => {
        return await TaskManagementApi.deleteProjectTasks(entity._id)
    })

    const [updateProject, isLoadingUpdate] = useFetching(useCallback(async () => {
            return await TaskManagementApi.updateProject(entity._id)
    }, []))


    const deleteEntityFunc = (e) => {
        e.preventDefault()
        if (type === "task") {
            deleteTask()
            .then(res => {
                if (res.errors || !res) return
                refetch()
                setDeleteModalOpen()
                setOpasity(false)
            })
        } 
        if (type === "project") {
            updateProject()
            .then(res => {
                if (res.errors || !res) return
                setDeleteModalOpen()
                setOpasity(false)
                navigate(MAIN_ROUTE)
            }) 
        }
            
        
    }

    function getTitle(type) {
        switch (type) {
            case "project" :
                return "Завершить проект?"
            case "task" : 
                return "Удалить задачу проекта?"
        }
    }
    function getSubtitle(type) {
        switch (type) {
            case "project" :
                return "Его можно будет восстановить"
            case "task" : 
                return "Восстановить содержимое уже не получится"
        }
    }
    function getButton(type) {
        switch (type) {
            case "project" :
                return "В архив"
            case "task" : 
                return "Удалить"
        }
    }
    function getClassname(type) {
        switch (type) {
            case "project" :
                return "btn-shape__filled"
            case "task" : 
                return "btn-shape__filled btn-shape__filled_delete"
        }
    }
    return (
        <div className="modal-delete-project modal-delete" >
            <form className="form">
                <h2 className="modal-delete__title">{getTitle(type)}</h2>
                <p className="modal-delete__descr">{getSubtitle(type)}</p>
                <fieldset className="form__fieldset">
                    <div className="field-wrapper">
                        <div className="field">
                            <button
                            className={getClassname(type)}
                            type="submit"
                            onClick={(e) => deleteEntityFunc(e)}
                            >
                            {isLoadingDelete || isLoadingUpdate ? <Spiner /> : getButton(type)}
                            </button>
                        </div>
                        <div className="field">
                            <button
                                className="btn-shape__empty"
                                id="closeModalDeleteItem"
                                type="button"
                                onClick={() => {setDeleteModalOpen(), setOpasity(false)}}
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                </fieldset>
            </form>
        </div>
    );
};

export default DeleteProjectTaskModal;
