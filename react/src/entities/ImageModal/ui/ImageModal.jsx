import "pages/MainPage/ui/sass/main.scss"
import "entities/ImageModal/ui/imageModal.scss"
import { ModalWrapper } from 'shared/ui/ModalWrapper'
import { Swiper ,SwiperSlide } from 'swiper/react'
import 'swiper/css';
import Cross from "shared/assets/img/cross.svg"
import { useEffect, useState } from "react";

export const ImageModal = ({images, setOpen, imgIndex}) => {
  const getSrc = (file) => URL.createObjectURL(file)
  const [image, setImage] = useState(imgIndex)
  return (
    <ModalWrapper>
      <div className="imgModal">
        <Cross className="imgModal__cross" onClick={() => setOpen(false)}/>
        <div className='imgModal__img-container'>
          <img
            src={images[image]?.name ? getSrc(images[image]) : images[image]?.url}
          />
        </div>
        <div className="imgModal__slider-wrap">
          <Swiper
            slidesPerView={'auto'}
            spaceBetween={24}
          >
            {images.map((img, index) => {
              return (
                <SwiperSlide
                  key={index}
                  onClick={() => setImage(index)}
                  initialslide={imgIndex}
                >
                  <div className="img-container">
                    <img
                      src={img.name ? getSrc(img) : img?.url}
                    />
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
      </div>
    </ModalWrapper>
  )
}
