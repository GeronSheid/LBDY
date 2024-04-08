import React, { useEffect, useState } from "react";
import { MobileContacts } from 'entities/MobileContacts';
import { Sidebar } from "widgets/Sidebar";
import { OurContacts } from "widgets/OurContacts";
import { RatedReview } from "widgets/RatedReview";
import { Feedback } from "widgets/Feedback/ui/Feedback";
import { ContactsModal } from "widgets/ContactsModal";
import ContactsApi from 'shared/api/ContactsApi';
import useFetching from "shared/hooks/useFetching";
import useWindow from "shared/hooks/useWindow";
import './sass/contactsPage.scss'

const ContactsPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [review, setReview] = useState('');
    const [feedback, setFeedback] = useState('');
    const [currentQueryType, setCurrentQueryType] = useState();
    const {windowWidth, windowHeight, orientation} = useWindow();    
    const modalData = [{heading: 'Спасибо за обратную связь!', text: null, btn: 'Отправить'}, {heading: 'В ближайшее время мы обработаем запрос', text: 'Ответ придёт через телеграм-бот', btn: 'Отправить запрос'}]
    const [modalDataVariant, setModalDataVariant] = useState();
    const isMobile = windowWidth < 1025 || windowHeight <= 600;

    useEffect(() => {
        document.title = 'Элбади - Контакты'
    },[])

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
            setModalDataVariant(1)
            sendReview();
            setReview('');
        } 
        else if (currentQueryType === feedbackQueryType) {
            
            sendFeedback();
            setFeedback('');
        }
        switchModal();
    };
    return ( 
        <>    
        {isMobile ? (
            <>
                <MobileContacts/>
            </>
        ) : (
        <div className="main-container">
            <Sidebar/>
            <OurContacts/>
            <RatedReview 
                openModal={() => switchModal(ratedReviewQueryType)} 
                value={review} 
                onChange={setReview} 
            />
            <Feedback 
                openModal={() => switchModal(feedbackQueryType)} 
                value={feedback} 
                onChange={setFeedback} 
            />
            {
            showModal && (<ContactsModal 
                    onClose={switchModal} 
                    onSend={handleSendForm}
                    modalData={modalData[modalDataVariant]}
                    /> )
            }
        </div>
        )}
        </>  
    )
};

export default ContactsPage;