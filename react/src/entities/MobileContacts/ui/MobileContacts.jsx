import React, { useState, useRef } from 'react'
import 'widgets/OurContacts/ui/OurContacts.scss';
import 'entities/MobileContacts/ui/MobileContacts.scss';
import {ContactItems, PolicyItems} from "widgets/ContactsCommon";
import Arrow from "shared/assets/img/smallArrow.svg";
import {Feedback} from "widgets/Feedback/ui/Feedback";
import {RatedReview} from "widgets/RatedReview/ui/RatedReview";
import { CSSTransition } from "react-transition-group";
//some test imports
import useFetching from "shared/hooks/useFetching";
import ContactsApi from 'shared/api/ContactsApi';
import { ContactsModal } from "widgets/ContactsModal";

const MobileLinks = ({openRatedReview, openFeedback}) => {
    //COPIED from contactspage

    const [showModal, setShowModal] = useState(false);
    const [review, setReview] = useState('');
    const [feedback, setFeedback] = useState('');
    const [currentQueryType, setCurrentQueryType] = useState();
    const modalData = [{heading: 'Спасибо за обратную связь!', text: null, btn: 'Отправить'}, {heading: 'В ближайшее время мы обработаем запрос', text: 'Ответ придёт через телеграм-бот', btn: 'Отправить запрос'}]
    const [modalDataVariant, setModalDataVariant] = useState();

    const switchModal = (queryType) => {
        if (!showModal) {
            queryType === 'отзыв' ? setModalDataVariant(0) : null;
            queryType === 'баг' ? setModalDataVariant(1) : null;
            setCurrentQueryType(queryType);
        } else {
            setCurrentQueryType(undefined);
        }
        setShowModal(!showModal);
    }

    const ratedReviewQueryType = 'отзыв';
    const [sendReview] = useFetching(async () => {
        return await ContactsApi.sendFeedback(review, ratedReviewQueryType, '');
    });

    const feedbackQueryType = 'баг';
    const [sendFeedback] = useFetching(async () => {
        return await ContactsApi.sendFeedback(feedback, feedbackQueryType, 'Проблема');
    });

    
    const handleSendForm = () => {
        if (currentQueryType === ratedReviewQueryType) {
            sendReview();
            setReview('')
        } 
        else if (currentQueryType === feedbackQueryType) {
            sendFeedback();
            setFeedback('');
        }
        switchModal();
    };
    //end of copy

    const feedbackRef = useRef(null);
    const ratedReviewRef = useRef(null);
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [ratedReviewOpen, setRatedReviewOpen] = useState(false);

    function closeFeedback() {
        setFeedbackOpen(false);
    }
    function closeRatedReview() {
        setRatedReviewOpen(false);
    }

    return (
        <>
        <CSSTransition
            nodeRef={ratedReviewRef}
            classNames="rated-review"
            in={ratedReviewOpen}
            timeout={200}
            unmountOnExit
            >
            <RatedReview 
                elementRef={ratedReviewRef} 
                onClose={closeRatedReview} 
                openRatedReview={() => setRatedReviewOpen(true)}
                openModal={() => switchModal(ratedReviewQueryType)} 
                value={review} 
                onChange={setReview} 
            />
        </CSSTransition>
        <CSSTransition
            nodeRef={feedbackRef}
            classNames="feedback"
            in={feedbackOpen}
            timeout={200}
            unmountOnExit
            >
            <Feedback 
                elementRef={feedbackRef} 
                onClose={closeFeedback} 
                openFeedback={() => setFeedbackOpen(true)}
                openModal={() => switchModal(feedbackQueryType)} 
                value={feedback} 
                onChange={setFeedback} 
            />
        </CSSTransition>

        {/* also for test copied from contacts page */}
        {showModal && (<ContactsModal onClose={switchModal} onSend={handleSendForm} modalData={modalData[modalDataVariant]}/> )}
        {/* end of copy */}

        <div className='mobile-links-menu'>
            <div 
                className="mobile-links-menu__item"
                onClick={() => setRatedReviewOpen(true)}
            >
                <button 
                    className='mobile-links-menu__button'
                >
                    Оцени наш сайт
                </button>
                <Arrow />
            </div>
            <div 
                className="mobile-links-menu__item"
                onClick={() => setFeedbackOpen(true)}                
            >
                <button 
                    className='mobile-links-menu__button'
                >
                    Обратная связь
                </button>
                <Arrow />
            </div>            
        </div>
        </>
    )
}
export const MobileContacts = ({ onClose, elementRef }) => {
    
    return (
        <div className="mobile-contacts" ref={elementRef}>
            <div className="mobile">
                <button className='mobile-contacts close-btn' onClick={onClose} ></button>
            
                <div className="contacts-mobile header-mobile">Контакты </div>
            </div>
            <div className="contacts__content">                
                <>
                    <div>
                        <ContactItems/>
                        <MobileLinks/>
                    </div>
                    <div className="last">
                        <PolicyItems />
                    </div>
                </>                
            </div>
        </div>
    );
};