import './RemindersMobileModal.scss'
import useFetching from 'shared/hooks/useFetching';
import { useCallback, useEffect, useState } from 'react';
import TaskManagementApi from 'shared/api/TaskManagmentApi';
import {ReminderItemMobile} from "entities/ReminderItemMobile/ui/ReminderItemMobile.jsx";

export const RemindersMobileModal = ({elementRef, close, setReminderId, setOpasity, setDeleteModalOpen, refetchBool}) => {
  const [reminders, setReminders] = useState([])

  const [getReminders, remindersLoading] = useFetching(useCallback(async (skip) => {
    return await TaskManagementApi.getListOfReminders(skip)
  }, []))

  useEffect(() => {
    getReminders(0)
      .then(res => {
        if(!res || res.errors) return
        setReminders([...res.data])
      })
  }, [refetchBool])
  
  return (
    <div ref={elementRef} className='remindersMobileModal'>
      <button className='remindersMobileModal__closeButton' onClick={close} ></button>
        <h2 className="remindersMobileModal__title">Напоминания</h2>
        <div className='remindersMobileModal__wrap'>
          <div className='remindersMobileModal__scrollable'>
            {reminders.map(reminder => (
                <ReminderItemMobile setReminderId={setReminderId} setOpasity={setOpasity} setDeleteModalOpen={setDeleteModalOpen} reminder={reminder} key={reminder._id}/>
            ))}
            {!reminders.length && 
            <div className='remindersMobileModal__empty'>
              Напоминаний нет
            </div>}
          </div>
        </div>
    </div>
  )
}
