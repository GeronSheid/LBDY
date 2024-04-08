import React, { useState } from 'react';
import 'widgets/RatedReview/ui/RatedReview.scss';
import { Input } from 'shared/ui/Input';
import useWindow from "shared/hooks/useWindow";
import { ModalHeader } from 'shared/ui/ModalHeader/ui/ModalHeader'

export const RatedReview = ({ openModal, value, onChange, onClose, elementRef }) => {

    const {windowWidth, windowHeight, orientation} = useWindow();    
    const isMobile = windowWidth < 1025 || windowHeight <= 600;

    const RatedReviewHeader = () => {
        return (
            <div className="rated-review__header">
                Оцени наш сайт
            </div>
        )
    }

    return (        
        <div className="rated-review"  ref={elementRef}>       
            {isMobile ? (
                <ModalHeader 
                    showModal={() => onClose()}
                    title={'Оцени наш сайт'} />
            ) : (
                <RatedReviewHeader/>
            )}
            
            <Input
                type="textarea"
                placeholder="Оставь свой отзыв"
                className="rated-review__textarea"
                value={value}
                setValue={(e) => onChange(e.target.value)}
            />
            <button 
                className="btn-shape__filled"
                id="addNewReview"
                type="button"
                onClick={() => openModal()}> 
                Отправить
            </button>  
        </div>
    );
};