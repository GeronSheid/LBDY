import { useCallback, useEffect, useRef, useState } from "react";
import 'widgets/LessonModal/ui/LessonModal.scss'
import { classNames } from "shared/lib/classNames";
import { FileCard } from "shared/ui/FileCard";
import useFetching from "shared/hooks/useFetching";
import TaskManagementApi from "shared/api/TaskManagmentApi";
import { Input } from "shared/ui/Input";
import Download from "shared/assets/img/download.svg"
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import { ImageModal } from "entities/ImageModal";
import jwtDecode from "jwt-decode";
import { ModalWrapper } from "shared/ui/ModalWrapper";
import { ModalHeader } from "shared/ui/ModalHeader/ui/ModalHeader";
import { ModalFooter } from "shared/ui/ModalFooter/ui/ModalFooter";
import useWindow from "shared/hooks/useWindow";

export const LessonModal = ({ setLessonsModal, setThisLessonModal, lesson, setHasUpdated, groupId }) => {
  const [startValidation, setStartValidation] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isDrag, setIsDrag] = useState(false)
  const [oldFiles, setOldFiles] = useState([])
  const [oldImgs, setOldImgs] = useState([])
  const [files, setFiles] = useState([])
  const [imgs, setImgs] = useState([])
  const [check, setCheck] = useState({})
  const [usable, setUsable] = useState(true)
  const myGroupId = jwtDecode(localStorage.token).group_id;
  const inputRef = useRef()

  const { windowWidth, windowHeight, orientation } = useWindow();
  const isMobile = windowWidth < 1025 || windowHeight <= 600;

  //Для модалки с изображениями
  const [imgModal, setImgModal] = useState([])
  const [index, setIndex] = useState(0)
  const [imageModalOpen, setImageModalOpen] = useState(false)

  const [createHomework] = useFetching(async () => {
    return await TaskManagementApi.createHomework(name, lesson.id, description)
  })

  const [patchHomeWork] = useFetching(async () => {
    return await TaskManagementApi.patchHomework(check._id, name, description)
  })

  const [getLesson] = useFetching(useCallback(async () => {
    return await TaskManagementApi.getHomeworkData(lesson.id)
  }, [lesson.id]))

  const [sendFiles] = useFetching(useCallback(async (id) => {
    return await TaskManagementApi.sendFiles(id, [...files], [...imgs])
  }, [files, imgs]))

  const [deleteFiles] = useFetching(async (url) => {
    return await TaskManagementApi.deleteFile(check._id, url)
  })

  useEffect(() => {
    getLesson()
      .then(res => {
        if (!res || res.errors || !res.data) return
        setCheck(res.data)
        setName(res.data.name)
        setDescription(res.data.description)
        if (res.data.files) {
          setOldFiles([...oldFiles, ...res.data?.files])
        }
        if (res.data.images) {
          setOldImgs([...oldImgs, ...res.data?.images])
        }
      })
  }, [])
  useEffect(() => {
    if (groupId === undefined || +groupId === +myGroupId) {
      setUsable(true)
      return
    }
    if (+groupId !== +myGroupId) {
      setUsable(false)
    }
  }, [groupId])

  const uploadFile = (currentTarget) => {
    if (currentTarget.files[0]?.type.includes("image")) {
      setImgs([...imgs, ...currentTarget.files])
    } else {
      setFiles([...files, ...currentTarget.files])
    }
  }

  const deleteFile = (index_to_delete) => {
    setFiles(files.filter((file, index) => index !== index_to_delete))

  }

  const deleteImg = (e, index_to_delete) => {
    e.preventDefault()
    setImgs(imgs.filter((img, index) => index !== index_to_delete))
  }

  const deleteOldFile = (index_to_delete, url) => {
    setOldFiles(oldFiles.filter((file, index) => index !== index_to_delete))
    deleteFiles(url)
      .then(res => {
        if (!res || res.errors) return
        // setRefetchFiles()
      })
  }

  const deleteOldImg = (e, index_to_delete, url) => {
    e.preventDefault()
    setOldImgs(oldImgs.filter((img, index) => index !== index_to_delete))
    deleteFiles(url)
      .then(res => {
        if (!res || res.errors) return
        // setRefetchFiles()
      })
  }

  const getSrc = (file) => URL.createObjectURL(file)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDrag(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDrag(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    uploadFile(e.dataTransfer)
    setIsDrag(false)
  }

  const createNewHomework = () => {
    createHomework()
      .then(res => {
        if (res.errors || !res) return
        if (files.length !== 0 || imgs.length !== 0) {
          sendFiles(res.data._id)
        }
        setHasUpdated()
        setLessonsModal(false)
      })
  }

  const patchThisHomework = () => {
    patchHomeWork()
      .then(res => {
        if (res.errors || !res) return
        if (files.length !== 0 || imgs.length !== 0) {
          sendFiles(res.data._id)
        }
        setHasUpdated()
        setLessonsModal(false)
      })
  }

  const handleSubmit = () => {
    if (name === '' || description === '') {
      setStartValidation(true)
    } else {
      Object.keys(check).length === 0
        ?
        createNewHomework()
        :
        patchThisHomework()
    }
  }

  const formatedAudience = lesson.audience !== null ? (lesson.audience.indexOf('&') != -1 ? lesson.audience.split('&') : lesson.audience) : '-';

  return (
    <>
      {imageModalOpen &&
        <ModalWrapper>
          <ImageModal images={imgModal} setOpen={setImageModalOpen} imgIndex={index} />
        </ModalWrapper>}
      <div className="modalWindow modalWindow_light lessonModal">
        <ModalHeader
          showModal={() => {
            setLessonsModal(false)
            setThisLessonModal(false)
          }}
          title={new Date(lesson.date).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}
        />
        {!isMobile &&
          <div className={usable ? "lesson-modal__info lesson-info" : "lesson-modal__info lesson-info lesson-info__notThisGroup"}>
            <ul className="lesson-info__list">
              <li className="lesson-info__item">
                <span className="lesson-info__item_label">
                  Название
                </span>
                <span className="lesson-info__item_value">
                  {lesson.subject.name}
                </span>
              </li>
              <li className="lesson-info__item">
                <span className="lesson-info__item_label">
                  Тип
                </span>
                <span className="lesson-info__item_value">
                  {lesson.occupation.name}
                </span>
              </li>
              <li className="lesson-info__item">
                <span className="lesson-info__item_label">
                  Время
                </span>
                <span className="lesson-info__item_value">
                  {`${lesson.class_time.start_of_class.slice(0, -3)} - ${lesson.class_time.end_of_class.slice(0, -3)}`}
                </span>
              </li>
              <li className="lesson-info__item">
                <span className="lesson-info__item_label">
                  Аудитория
                </span>
                <span className="lesson-info__item_value">
                  {typeof formatedAudience === 'object' ? formatedAudience.map(item => (
                    <>
                      <span>{item}<br /></span>
                    </>)) : formatedAudience}
                </span>
              </li>
              <li className="lesson-info__item">
                <span className="lesson-info__item_label">
                  Преподаватель
                </span>
                <span className="lesson-info__item_value">
                  {lesson.teacher ?
                    `${lesson?.teacher?.middle_name} ${lesson?.teacher?.first_name} ${lesson?.teacher?.last_name}`
                    :
                    "-"}
                </span>
              </li>
            </ul>
          </div>
        }
        {isMobile && !usable && 
          <div className="modalWindow__content">
            <div className={usable ? "lesson-modal__info lesson-info" : "lesson-modal__info lesson-info lesson-info__notThisGroup"}>
              <ul className="lesson-info__list">
                <li className="lesson-info__item">
                  <span className="lesson-info__item_label">
                    Название
                  </span>
                  <span className="lesson-info__item_value">
                    {lesson.subject.name}
                  </span>
                </li>
                <li className="lesson-info__item">
                  <span className="lesson-info__item_label">
                    Тип
                  </span>
                  <span className="lesson-info__item_value">
                    {lesson.occupation.name}
                  </span>
                </li>
                <li className="lesson-info__item">
                  <span className="lesson-info__item_label">
                    Время
                  </span>
                  <span className="lesson-info__item_value">
                    {`${lesson.class_time.start_of_class.slice(0, -3)} - ${lesson.class_time.end_of_class.slice(0, -3)}`}
                  </span>
                </li>
                <li className="lesson-info__item">
                  <span className="lesson-info__item_label">
                    Аудитория
                  </span>
                  <span className="lesson-info__item_value">
                    {typeof formatedAudience === 'object' ? formatedAudience.map(item => (
                      <>
                        <span>{item}<br /></span>
                      </>)) : formatedAudience}
                  </span>
                </li>
                <li className="lesson-info__item">
                  <span className="lesson-info__item_label">
                    Преподаватель
                  </span>
                  <span className="lesson-info__item_value">
                    {lesson.teacher ?
                      `${lesson?.teacher?.middle_name} ${lesson?.teacher?.first_name} ${lesson?.teacher?.last_name}`
                      :
                      "-"}
                  </span>
                </li>
              </ul>
            </div> 
          </div>
        }
        {usable &&
          <div className="modalWindow__content">
            {isMobile &&
              <div className={usable ? "lesson-modal__info lesson-info" : "lesson-modal__info lesson-info lesson-info__notThisGroup"}>
              <ul className="lesson-info__list">
                <li className="lesson-info__item">
                  <span className="lesson-info__item_label">
                    Название
                  </span>
                  <span className="lesson-info__item_value">
                    {lesson.subject.name}
                  </span>
                </li>
                <li className="lesson-info__item">
                  <span className="lesson-info__item_label">
                    Тип
                  </span>
                  <span className="lesson-info__item_value">
                    {lesson.occupation.name}
                  </span>
                </li>
                <li className="lesson-info__item">
                  <span className="lesson-info__item_label">
                    Время
                  </span>
                  <span className="lesson-info__item_value">
                    {`${lesson.class_time.start_of_class.slice(0, -3)} - ${lesson.class_time.end_of_class.slice(0, -3)}`}
                  </span>
                </li>
                <li className="lesson-info__item">
                  <span className="lesson-info__item_label">
                    Аудитория
                  </span>
                  <span className="lesson-info__item_value">
                    {typeof formatedAudience === 'object' ? formatedAudience.map(item => (
                      <>
                        <span>{item}<br /></span>
                      </>)) : formatedAudience}
                  </span>
                </li>
                <li className="lesson-info__item">
                  <span className="lesson-info__item_label">
                    Преподаватель
                  </span>
                  <span className="lesson-info__item_value">
                    {lesson.teacher ?
                      `${lesson?.teacher?.middle_name} ${lesson?.teacher?.first_name} ${lesson?.teacher?.last_name}`
                      :
                      "-"}
                  </span>
                </li>
              </ul>
            </div> 
            }
            <legend className="modalWindow__legend modalWindow__legend_align-start">Домашнее задание</legend>
            <Input
              className="input__simple-input_light"
              type="text"
              name="name"
              placeholder="Название"
              value={name}
              setValue={(e) => setName(e.target.value)}
              validation={startValidation && name === ''}
              validationText="Это поле должно быть заполнено"
            />
            <Input
              className="input__textarea_light"
              type="textarea"
              placeholder="Описание"
              value={description}
              setValue={(e) => setDescription(e.target.value)}
              validation={description === '' && startValidation}
              validationText="Это поле должно быть заполнено"
            />
            <div className="field">
              {!isMobile &&
                <div className={classNames(
                  "form__drop-zone",
                  { ["on-drag"]: isDrag, ["form__drop-zone_dark"]: true },
                  []
                )}
                  onDragOver={(e) => handleDragOver(e)}
                  onDragLeave={(e) => handleDragLeave(e)}
                  onDrop={(e) => handleDrop(e)}
                  onClick={() => inputRef.current.click()}
                >
                  <input
                    type="file"
                    multiple
                    hidden
                    ref={inputRef}
                    onChange={(e) => uploadFile(e.target)}
                  />
                  {isDrag ?
                    <Download style={{ fill: "#49902e" }} />
                    :
                    <span className="input-submit" >Добавить файл</span>
                  }
                </div>
              }
              {isMobile &&
                <input
                  type="file"
                  multiple
                  hidden
                  ref={inputRef}
                  onChange={(e) => uploadFile(e.target)}
                /> 
              }
              {oldFiles.length !== 0 &&
                oldFiles.map((file, index) => {
                  return <FileCard
                    key={index}
                    index={index}
                    name={file.name ? file.name : file.filename}
                    url={file.url ? file.url : ''}
                    deleteFile={deleteOldFile}
                    isDark={true}
                  />
                })
              }
              {files.length !== 0 &&
                files.map((file, index) => {
                  return <FileCard
                    key={index}
                    index={index}
                    name={file.name ? file.name : file.filename}
                    url={file?.url ? file.url : '#'}
                    deleteFile={deleteFile}
                    isDark={true}
                  />
                })
              }
              <Swiper
                className="img-slider"
                slidesPerView={'auto'}
                spaceBetween={24}
              >
                {oldImgs.length !== 0 &&
                  oldImgs.map((img, index) => {
                    return (
                      <SwiperSlide key={index}>
                        <div className="img-container">
                          <button className="delete-image" onClick={(e) => deleteOldImg(e, index, img.url)}></button>
                          <img
                            onClick={() => { setImgModal([...imgs, ...oldImgs]); setIndex(+index); setImageModalOpen(true); }}
                            src={img.name ? getSrc(img) : img?.url}
                            style={{ borderRadius: 10 }}
                          />
                        </div>
                      </SwiperSlide>
                    )
                  })
                }
                {imgs.length !== 0 &&
                  imgs.map((img, index) => {
                    return (
                      <SwiperSlide key={index}>
                        <div className="img-container">
                          <button className="delete-image" onClick={(e) => deleteImg(e, index)}></button>
                          <img
                            onClick={() => { setImgModal([...imgs, ...oldImgs]); setIndex(oldFiles.length - 1 + +index); setImageModalOpen(true) }}
                            src={img.name ? getSrc(img) : img?.url}
                            style={{ borderRadius: 10 }}
                          />
                        </div>
                      </SwiperSlide>
                    )
                  })
                }
              </Swiper>
            </div>
            <ModalFooter
              submitFunction={() => handleSubmit()}
              isMobile={isMobile}
              uploadFunction={(e) => uploadFile(e.target)}
              inputRef={inputRef}
              type={'Домашнее задание'}
            />
          </div>
        }
      </div>
    </>
  )
};
