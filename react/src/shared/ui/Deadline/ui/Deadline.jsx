import "pages/MainPage/ui/sass/main.scss"
import {classNames} from "shared/lib/classNames";
import useFetching from "shared/hooks/useFetching";
import TaskManagementApi from "shared/api/TaskManagmentApi";
import {useLayoutEffect, useRef, useState} from "react";
import {gsap} from "gsap";
import { Checkbox } from "shared/ui/Checkbox";

const Deadline = ({
    name, 
    date, 
    id, 
    setRefetchdeadlinesBool, 
    setHidePatchModal, 
    setDeadline, 
    deadline, 
    setShowDeadlines = () => {},
    setShowModal}) => {
    const currentDate = new Date()
    const dataDate = new Date(date)
    const [moveToArchive, setMoveToArchive] = useState(false)
    const [archiveDeadline] = useFetching(async () => {
        return await TaskManagementApi.updateDeadline(id, name, date)
    })

    useLayoutEffect(() => {
        if (!moveToArchive) return
        let line = document.getElementById(`pp${id}Line`);
        gsap.fromTo(
            line,
            { width: 0 },
            {
                visibility: "visible",
                width: "103px",
                duration: 1,
                onComplete: () => {setRefetchdeadlinesBool(), setMoveToArchive(false)}
            }
            
        );
    }, [moveToArchive]);

    const archiveDeadlineFunc = (e) => {
        e.preventDefault()
        archiveDeadline()
            .then(res => {
                if (res.errors || !res) return
                setMoveToArchive(true)
            })
    }

    const checkBoxRef = useRef(null)
    return (
        <div
            
            className={classNames(
            "reminders-item",
            {["reminders-item_overdue"]: dataDate < currentDate},
            []
            )}
            id={`pp${id}Item`}
        >
        <div className="reminders-item__row"
            onClick={(e) =>{
                e.preventDefault();
                setShowDeadlines(true);
                setHidePatchModal(false); 
                setDeadline(deadline); 
                setShowModal(true)}}
        >
            <div className="reminders-item__info deadline-btn-tmp-class">
                <span className="reminders-item__title">
                    {dataDate.toLocaleDateString('ru-RU', {
                                                            year: 'numeric',
                                                            month: '2-digit',
                                                            day: '2-digit',
                                                        })}
                        <span className="reminders-item__line-through" id={`pp${id}Line`}>

                        </span>
                </span>

                
            </div>
            <div className="reminders-item__descr">{name}</div>
        </div>
            
            
            <form className="reminders-item__checkbox">
                <fieldset className="form__fieldset">
                    <div className="field input__checkbox">
                        <Checkbox
                            idVar={id}
                            handleClick={archiveDeadlineFunc}
                            defChecked={moveToArchive}
                            isDark={true}    
                        />
                    </div>
                </fieldset>
            </form>
        </div>
    );
};

export default Deadline;
