
import { useEffect, useRef, useState, useCallback } from "react";

import { Swiper, SwiperSlide } from 'swiper/react';

import { ImageModal } from "entities/ImageModal";
import { classNames } from "shared/lib/classNames";
import { ModalHeader } from "shared/ui/ModalHeader/ui/ModalHeader";
import { ModalFooter } from "shared/ui/ModalFooter/ui/ModalFooter";
import { FileCard } from "shared/ui/FileCard";
import { Input } from "shared/ui/Input";
import useFetching from "shared/hooks/useFetching";
import TaskManagementApi from "shared/api/TaskManagmentApi";
import { Select } from "widgets/Select";

import Download from "shared/assets/img/download.svg"

import "pages/MainPage/ui/sass/main.scss";
import "./CreatehomeworksModal.scss";

const CreateHomeworksModal = ({ homeworks, setHomeworksModal, setHide, setHasUpdated, isMobile = true }) => {
    const [remindForm, setRemindForm] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState(null)
    const [options, setOptions] = useState([])
    const [subject, setSubject] = useState("")
    const [isDrag, setIsDrag] = useState(false)
    const [files, setFiles] = useState([])
    const [imgs, setImgs] = useState([])
    const [startValidation, setStartValidation] = useState(false)

    //Для модалки с изображениями
    const [imgModal, setImgModal] = useState([])
    const [index, setIndex] = useState(0)
    const [imageModalOpen, setImageModalOpen] = useState(false)

    const formatedDate = date ? `${date?.getFullYear()}-${(date?.getMonth() + 1).toString().length === 1 ? '0' + (date?.getMonth() + 1).toString() : (date?.getMonth() + 1).toString()}-${date?.getDate() .toString().length === 1 ? '0' + date?.getDate().toString() : date?.getDate().toString()}` : null;

    const [newReminderTmp, setNewReminderTmp] = useState({
        days: [],
    })
    const [enableSelect, setEnableSelect] = useState(true)


    const [getLessons] = useFetching(useCallback(async () => {
        return await TaskManagementApi.getLessonsList(formatedDate)
    }, [date]))

    const [createHomework, isPreLoading] = useFetching(async () => {
        return await TaskManagementApi.createHomework(name, subject.value, description)
    })

    const [sendFiles, isPostLoading] = useFetching(useCallback(async (id) => {
        return await TaskManagementApi.sendFiles(id, [...files], [...imgs])
    }, [files, imgs]))

    const [createReminder, isLoading] = useFetching(useCallback(async (id) => {
        return await TaskManagementApi.createReminder({ ...newReminderTmp, entity_id: id, min: newReminderTmp.min >= 15 ? "30" : "00" })
    }, [newReminderTmp]))

    const inputRef = useRef()
    
    useEffect(() => {
        if (date !== null) {
            getLessons()
                .then(res => {
                    if (res.errors || !res) return
                    setEnableSelect(false)
                    setOptions(res.data.map(option => ({ label: option.lesson, value: option.lesson_id })))
                })
        }
    }, [date])

    const createReminderFunc = () => {
        if (name === ''
            ||
            date === ''
            ||
            description === ''
            ||
            subject === ''
            ||
            newReminderTmp.days.length === 0
            ||
            newReminderTmp.min === 0
            ||
            newReminderTmp.hour === 0
            ||
            newReminderTmp.text === '') {
            setStartValidation(true)
        } else {
            createHomework()
                .then(res => {
                    if (res.errors || !res) return
                    if (files.length !== 0 || imgs.length !== 0) {
                        sendFiles(res.data._id)
                    }
                    createReminder(res.data._id)
                        .then(res => {
                            if (res.errors || !res) return
                            setHasUpdated()
                            setHomeworksModal(false)
                        })
                })
        }

    }

    const createHomeworkFunc = () => {
        if (name === '' || date === null || description === '' || subject === '' || subject.length === 0) {
            setStartValidation(true)
        } else {
            createHomework()
                .then(res => {
                    if (res.errors || !res) return
                    if (files.length !== 0 || imgs.length !== 0) {
                        sendFiles(res.data._id)
                            .then()
                    }
                    setHasUpdated()
                    setHomeworksModal(false)
                    setHide(true)
                })
        }

    }

    const handleSubmit = () => {
        !remindForm ? createHomeworkFunc() : createReminderFunc()
    }

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

    const uploadFile = (currentTarget) => {
        for (let i = 0; i < currentTarget.files.length; i++) {
            if (currentTarget.files[i].type.includes("image")) {
                setImgs([...imgs, currentTarget.files[i]])
            } else {
                setFiles([...files, currentTarget.files[i]])
            }
        }
    }

    const deleteFile = (index_to_delete) => {
        setFiles(files.filter((file, index) => index !== index_to_delete))
    }

    const deleteImg = (e, index_to_delete) => {
        e.preventDefault()
        setImgs(imgs.filter((img, index) => index !== index_to_delete))
    }

    const getSrc = (file) => URL.createObjectURL(file)
    return (
        <>
            {imageModalOpen && <ImageModal images={imgModal} setOpen={setImageModalOpen} imgIndex={index} />}
            <div className="modalWindow">
                <ModalHeader
                    showModal={() => {
                        setHide(true)
                        setHomeworksModal(false)
                    }}
                    title={'Домашнее задание'}
                />
                <div className="modalWindow__content">
                    <Input
                        className={isMobile ? "input__simple-input_light" : "input__simple-input_dark"}
                        type="text"
                        placeholder="Название"
                        value={name}
                        setValue={(e) => setName(e.target.value)}
                        validation={name === '' && startValidation}
                        validationText="Это поле должно быть заполнено"
                    />
                    <Input
                        className={isMobile ? "input__textarea_light" : "input__textarea_dark"}
                        type="textarea"
                        placeholder="Описание"
                        value={description}
                        setValue={(e) => setDescription(e.target.value)}
                        validation={description === '' && startValidation}
                        validationText="Это поле должно быть заполнено"
                    />
                    <div className="field-wrapper">
                        <Input
                            type="date"
                            className={isMobile ? "input__simple-input_light" : "input__simple-input_dark"}
                            placeholder="Дата выполнения"
                            value={date}
                            setValue={(e) => setDate(e)}
                            validation={date === null && startValidation}
                            validationText="Выбери дату"
                        />
                        <div className={isMobile ? "field field_light" : "field field_dark"} id="selectLesson">
                            <Select
                                placeholder={"Пара"}
                                optionsType="default"
                                options={options}
                                chooseOption={subject}
                                setChooseOption={(e) => setSubject(e)}
                                validation={subject === '' && startValidation}
                                disabled={enableSelect}
                                validationText="Выбери пару"
                            />
                        </div>
                    </div>
                    {!isMobile &&
                        <div className="field" id="homeTaskDropZone">
                            <div className={classNames(
                                "form__drop-zone",
                                { ["on-drag"]: isDrag },
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
                                    <Download style={{ fill: "rgba(255, 255, 255, 0.90)" }} />
                                    :
                                    <span className="input-submit" >Добавить файл</span>
                                }
                            </div>
                            {files.length !== 0 &&
                                files.map((file, index) => {
                                    return <FileCard
                                        key={index}
                                        index={index}
                                        name={file.name}
                                        deleteFile={deleteFile}
                                        isDownload={false}
                                    />
                                })
                            }
                            <Swiper
                                className="img-slider"
                                slidesPerView={'auto'}
                                spaceBetween={24}
                            >
                                {imgs.length !== 0 &&
                                    imgs.map((img, index) => {
                                        return (
                                            <SwiperSlide key={index}>
                                                <div className="img-container">
                                                    <button className="delete-image" onClick={(e) => deleteImg(e, index)}></button>
                                                    <img
                                                        onClick={() => { setImgModal([...imgs]); setIndex(index); setImageModalOpen(true) }}
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
                    }
                    {isMobile &&
                        <div className="field">
                            <input
                                type="file"
                                multiple
                                hidden
                                ref={inputRef}
                                onChange={(e) => uploadFile(e.target)}
                            />
                            {files.length !== 0 &&
                                files.map((file, index) => {
                                    return <FileCard
                                        key={index}
                                        index={index}
                                        name={file.name}
                                        deleteFile={deleteFile}
                                        isDownload={false}
                                        isDark={true}
                                    />
                                })
                            }
                            <Swiper
                                className="img-slider"
                                slidesPerView={'auto'}
                                spaceBetween={24}
                            >
                                {imgs.length !== 0 &&
                                    imgs.map((img, index) => {
                                        return (
                                            <SwiperSlide key={index}>
                                                <div className="img-container">
                                                    <button className="delete-image" onClick={(e) => deleteImg(e, index)}></button>
                                                    <img
                                                        onClick={() => { setImgModal([...imgs]); setIndex(+index); setImageModalOpen(true) }}
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
                    }
                    <ModalFooter
                        isMobile={isMobile}
                        submitFunction={() => handleSubmit()}
                        setRemindForm={() => setRemindForm(!remindForm)}
                        remindForm={remindForm}
                        reminderSwitcher={true}
                        startValidation={startValidation}
                        newReminderTmp={newReminderTmp}
                        setNewReminderTmp={setNewReminderTmp}
                        date={date}
                        isDark={!isMobile}
                        uploadFunction={(e) => uploadFile(e.target)}
                        inputRef={inputRef}
                        type={'Домашнее задание'}
                    />
                </div>
            </div>
        </>
    );
};

export default CreateHomeworksModal;
