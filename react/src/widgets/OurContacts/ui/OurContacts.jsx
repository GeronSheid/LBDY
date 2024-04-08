import React from "react";
import 'widgets/OurContacts/ui/OurContacts.scss';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import useWindow from "shared/hooks/useWindow";
import {ContactItems, FirstContactItems, SecondContactItems, PolicyItems} from "widgets/ContactsCommon";

export const OurContacts = () => {
    const {windowWidth, windowHeight, orientation} = useWindow();
    const tablet = windowWidth > 1024 && windowWidth <= 1440 || windowHeight <= 960;

    return (
        <div className="contacts">
            <div className="contacts__header">Наши контакты</div>
                <div className="contacts__content">
                {tablet ? (
                    <Swiper className="projects-swiper"
                        modules={[Pagination]}
                        pagination={{
                            clickable: true,
                        }}
                        slidesPerView={1}
                        spaceBetween={24}
                    >
                        <SwiperSlide>
                            <FirstContactItems/>
                        </SwiperSlide>
                        <SwiperSlide>
                            <SecondContactItems/>
                        </SwiperSlide>
                        <SwiperSlide>
                            <PolicyItems/>
                        </SwiperSlide>
                    </Swiper>               
                    ) : (    
                    <>
                    <div className="contacts__contacts-wrap">
                        <FirstContactItems/>
                        <SecondContactItems/>
                    </div>
                        {/* <Swiper className="projects-swiper"
                        modules={[Pagination]}
                        pagination={{
                            clickable: true,
                        }}
                        slidesPerView={1}
                        spaceBetween={24}
                    >
                        <SwiperSlide>
                            
                        </SwiperSlide>
                        <SwiperSlide>
                            
                        </SwiperSlide>                      
                        </Swiper> 
                        <ContactItems/> */}
                        <PolicyItems/>
                    </>
                )}
                </div>
        </div>
    );
};