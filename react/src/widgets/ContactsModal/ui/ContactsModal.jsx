import React, { useState } from "react";
import 'widgets/ContactsModal/ui/ContactsModal.scss';

export const ContactsModal = ({ onClose, onSend, modalData }) => {
        return (
        
        <div className="modalWrapper main-container_modal">
            <div className="contacts-modal">
                <div className="legend">
                    <div className={`upper-string ${!modalData.text && "upper-string_big-margin"}`}>{modalData.heading}</div>
                    {modalData.text &&
                        <div className="lower-string">{modalData.text}</div> 
                    }
                </div>
                <div className="btns-wrapper">
                    <button 
                        className={`contacts-modal__btn btn-shape__filled
                            ${window.innerWidth <= 1024 ? ' grey-btn' : ''}`}

                        type="submit"
                        onClick={() => onSend()}>
                            {modalData.btn}
                    </button>
                    <button 
                        className="contacts-modal__btn btn-shape__filled grey-btn"
                        type="submit" 
                        onClick={() => onClose()}>
                        Отменить
                    </button>
                </div>
            </div>
        </div>
    );
};