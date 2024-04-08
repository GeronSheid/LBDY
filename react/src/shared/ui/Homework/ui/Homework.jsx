import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import TaskManagementApi from 'shared/api/TaskManagmentApi'
import useFetching from 'shared/hooks/useFetching'
import { classNames } from 'shared/lib/classNames'
import {gsap} from "gsap";
import { Checkbox } from 'shared/ui/Checkbox';

export const Homework = ({ 
    name, 
    id, 
    lessonId, 
    setRefetchHomeworksBool, 
    refetchFiles, 
    setHidePatchModal, 
    setHomework, 
    homework, 
    setShowModal, 
    setHomeworkDate, 
    setShowDeadlines = () => {},
    setSorted, 
    homeworks, 
    index}) => {
    const currentDate = new Date()
    const [date, setDate] = useState('')
    const [files, setFiles] = useState({})
    const [moveToArchive, setMoveToArchive] = useState(false)

    const [getHomeworksData] = useFetching(useCallback(async (id) => {
        return await TaskManagementApi.getHomeworkData(id)
    },[refetchFiles]))

    const [archiveHomework] = useFetching(async () => {
        return await TaskManagementApi.updateHomeworkStatus(id)
    })

    useLayoutEffect(() => {
        if(!moveToArchive) return
        let line = document.getElementById(`pp${id}Line`)
        gsap.fromTo(
            line,
            { width: 0 },
            {
                visibility: "visible",
                width: "100%",
                duration: 1,
                onComplete: () => {setRefetchHomeworksBool(), setMoveToArchive(false)}
            }
        );
    },[moveToArchive])
    useEffect(() => {
        getHomeworksData(lessonId)
        .then(res => {
            if(res.errors || !res) return
            setDate(res.data.date)
            setFiles({files: res.data.files, imgs: res.data.images})
        })
    }, [lessonId, refetchFiles])

    const archiveHomeworkFunc = (e) => {
        e.preventDefault()
        archiveHomework()
            .then(res => {
                if (res.errors || !res) return
                setMoveToArchive(true)
            })
    }

    return (
        <div
            className={classNames(
            "reminders-item",
            {["reminders-item_overdue"]: new Date(date) < currentDate},
            []
            )}
            id={`pp${id}Item`}
        >
                    <div className='reminders-item__row'
                        onClick={(e) =>{
                            e.preventDefault();
                            setShowDeadlines(false);
                            setHidePatchModal(false);
                            setHomework({...homework, files});
                            setHomeworkDate(date);
                            setShowModal(true)}}
                    >
                        <div className="reminders-item__info hometask-btn-tmp-class">
                            <div className="reminders-item__title">
                                {name}
                                <span className="reminders-item__line-through" id={`pp${id}Line`}>

                                </span>
                            </div>
                        </div>
                        <span className="reminders-item__descr">
                                {new Date(date).toLocaleDateString('ru-RU', {
                                                                                year: 'numeric',
                                                                                month: '2-digit',
                                                                                day: '2-digit',
                                                                            })}
                        </span>
                    </div>
                    <form className="reminders-item__checkbox">
                        <fieldset className="form__fieldset">
                            <div className="field input__checkbox">
                                <Checkbox
                                    idVar={id}
                                    handleClick={archiveHomeworkFunc}
                                    defChecked={moveToArchive}
                                    isDark={true}
                                />
                            </div>
                        </fieldset>
                    </form>
                </div>
    )
}
