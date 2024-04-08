import './ReminderItemMobile.scss'
import DeleteReminder from "shared/assets/img/delete-reminder.svg";
import { CSSTransition } from 'react-transition-group';
import { DeleteModal } from 'entities/DeleteModal';
import { ModalWrapper } from 'shared/ui/ModalWrapper';
import { useState, useRef } from 'react';
import useWindow from 'shared/hooks/useWindow';

export const ReminderItemMobile= ({reminder, setDeleteModalOpen, setOpasity, setReminderId}) => {

  

  const {windowWidth, windowHeight, orientation} = useWindow();
  const isMobile = windowWidth < 1025 || windowHeight <= 600;


  const deleteRef = useRef(null)

  return (
    <div className='reminderItem'>

        <div className='reminderItem__text'>{reminder.text}</div>
        <div className='reminderItem__days'>
          Каждый {reminder.days.map((day, index) => (<span>{day}{index < reminder.days.length - 1 ? ", " : " "}</span>))} 
          в {reminder.hour}:{reminder.min ? "30" : "00"}
        </div>
        <div className='reminderItem__type'>
          <div className='reminderItem__type_title'>Тип </div> 
          <div className='reminderItem__type_value'>{reminder.entity_type}</div>
        </div>
        <div className='reminderItem__deadline'>
          <div className='reminderItem__deadline_title'>Дата</div> 
          <div className='reminderItem__deadline_value'>{new Date(reminder.exp_date).toLocaleDateString('ru-RU')}</div>
        </div>
        <div className='reminderItem__buttonWrapper'>
          <div className='reminderItem__button' onClick={() => {setOpasity(true), setDeleteModalOpen(true), setReminderId(reminder._id)}}>
            <DeleteReminder width={17.5} height={18}/>
          </div>
        </div>
    </div>
  )
}