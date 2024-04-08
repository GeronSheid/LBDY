import {useContext} from "react";
import {DeadlineModalsContext} from "shared/contexts/DeadlineModalsContext";
import useFetching from "shared/hooks/useFetching";
import TaskManagementApi from "shared/api/TaskManagmentApi";

const RecoverModal = ({
    type,
    name,
    id,
    closeFunc,
}) => {
    const {setDeleteInfo} = useContext(DeadlineModalsContext)
    const [deleteDeadline] = useFetching(async () => {
        return await TaskManagementApi.updateDeadline(id, name, date, "active")
    })

    const deleteDeadlineFunc = (e) => {
        e.preventDefault()
        deleteDeadline()
            .then(res => {
                if (res.errors || !res) return
                setDeleteInfo({})
            })
    }

    return (
        <div className="modal-restore">
            <form className="form">
                <h2 className="modal-restore__title">{`Восстановить ${type} ${name}?`}</h2>
                <fieldset className="form__fieldset">
                    <div className="field-wrapper">
                        <div className="field">
                            <button
                                className="btn-shape__filled"
                                type="submit"
                            >
                                Восстановить
                            </button>
                        </div>
                        <div className="field">
                            <button
                                className="btn-shape__empty"
                                id="closeModalRestoreItem"
                                type="button"
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

export default RecoverModal;
