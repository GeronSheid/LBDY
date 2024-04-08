import React, { useState, useRef } from 'react';
import 'widgets/Feedback/ui/Feedback.scss';
import { Input } from 'shared/ui/Input';
import useWindow from "shared/hooks/useWindow";
import { ModalHeader } from 'shared/ui/ModalHeader/ui/ModalHeader'

export const Feedback = ({openModal, value, onChange,  onClose, feedbackRef}) => {
    const {windowWidth, windowHeight, orientation} = useWindow();    
    const isMobile = windowWidth < 1025 || windowHeight <= 600;
    
    const FeedbackHeader = () => {
        return (
            <div className="feedback__header">
                Обратная связь
            </div>
        )
    }

    return (        
        <div className="feedback" ref={feedbackRef}>
            {isMobile ? (               
                <ModalHeader 
                showModal={() => onClose()} 
                title={'Обратная связь'} 
                />
            ) : (
                <FeedbackHeader/>
            )}           
                        
            <div className='feedback__wrapper'>
                <div className="feedback__text"> Где-то есть ошибка, не совпадает расписание или не хватает информации?</div>
                <div className="feedback__text">Напиши об этом здесь, либо свяжись с нами через телеграм-бот или почту</div>
            </div>
            
            <Input
                type="textarea"
                placeholder="Опиши проблему"
                className="feedback__textarea"
                value={value}
                setValue={(e) => onChange(e.target.value)}               
            />             
            <button 
                className="btn-shape__filled"
                id="addNewFeedback"
                type="button"
                onClick={() => openModal()}> 
                Отправить
            </button>  
        </div>
    );
};