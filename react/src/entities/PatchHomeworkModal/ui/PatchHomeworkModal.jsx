import { RemindForm } from "shared/ui/RemindForm";
import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import "pages/MainPage/ui/sass/main.scss"
import { Select } from "widgets/Select";
import "../../CreateHomeworksModal/ui/CreatehomeworksModal.scss"
import { classNames } from "shared/lib/classNames";
import Download from "shared/assets/img/download.svg"
import { FileCard } from "shared/ui/FileCard";
import { Input } from "shared/ui/Input";
import useFetching from "shared/hooks/useFetching";
import TaskManagementApi from "shared/api/TaskManagmentApi";
import Spiner from "../../../shared/assets/img/spinner.svg"
import { Switcher } from "shared/ui/Switcher/ui/Switcher";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { ImageModal } from "entities/ImageModal";
import { ModalHeader } from "shared/ui/ModalHeader/ui/ModalHeader";
import { ModalFooter } from "shared/ui/ModalFooter/ui/ModalFooter";



const PatchHomeworksModal = ({ homeworks, setHomeworksModal, setHide, setHasUpdated, setRefetchFiles, thisHomework, thisHomeworkDate, isMobile = true }) => {

    //Поля формы
    const [name, setName] = useState(thisHomework.name)
    const [description, setDescription] = useState(thisHomework.description)
    let setedDate = Date.parse(thisHomeworkDate)
    setedDate = new Date(setedDate)
    const [date, setDate] = useState(setedDate)

    //управление Select-ом
    const [options, setOptions] = useState([])
    const [subject, setSubject] = useState({ label: '', value: '' })
    const [enableSelect, setEnableSelect] = useState(true)

    //Файлы и дропбокс
    const [isDrag, setIsDrag] = useState(false)
    const [oldFiles, setOldFiles] = useState([])
    const [oldImgs, setOldImgs] = useState([])
    const [files, setFiles] = useState([])
    const [imgs, setImgs] = useState([])

    //Для модалки с изображениями
    const [imgModal, setImgModal] = useState([])
    const [index, setIndex] = useState(0)
    const [imageModalOpen, setImageModalOpen] = useState(false)

    //Для модалки напоминаний
    const [remindForm, setRemindForm] = useState(false)
    const [newReminderTmp, setNewReminderTmp] = useState({
        days: [],
    })
    const [startValidation, setStartValidation] = useState(false)
    const [isPrevReminder, setIsPrevReminder] = useState()
    const formatedDate = date ? `${date?.getFullYear()}-${(date?.getMonth() + 1).toString().length === 1 ? '0' + (date?.getMonth() + 1).toString() : (date?.getMonth() + 1).toString()}-${date?.getDate() .toString().length === 1 ? '0' + date?.getDate().toString() : date?.getDate().toString()}` : null;

    //Функции для запросов
    const [getLessons] = useFetching(useCallback(async () => {
        return await TaskManagementApi.getLessonsList(formatedDate)
    }, [date]))

    const [patchHomeWork, isLoading] = useFetching(async () => {
        return await TaskManagementApi.patchHomework(thisHomework.home_task_id, name, description)
    })

    const [sendFiles, isLoadingFiles] = useFetching(useCallback(async (id) => {
        return await TaskManagementApi.sendFiles(id, [...files], [...imgs])
    }, [files, imgs]))

    const [deleteFiles] = useFetching(async (url) => {
        return await TaskManagementApi.deleteFile(thisHomework.home_task_id, url)
    })

    const [createReminder, isPreLoading] = useFetching(useCallback(async (id) => {
        return await TaskManagementApi.createReminder({ ...newReminderTmp, entity_id: id, min: newReminderTmp.min >= 15 ? "30" : "00" })
    }, [newReminderTmp]))

    const [patchReminder, isPostLoading] = useFetching(useCallback(async () => {
        return await TaskManagementApi.patchReminder(newReminderTmp._id,
            {
                days: newReminderTmp.days, hour: newReminderTmp.hour, min: newReminderTmp.min >= 15 ? "30" : "00",
                text: newReminderTmp.text, exp_date: newReminderTmp.exp_date
            })
    }, [newReminderTmp]))

    const [fetchThisReminder, isLoadingThisReminder, isThisReminderAbsence] = useFetching(useCallback(async (id) => {
        return await TaskManagementApi.getThisReminder(id)
    }, [thisHomework.home_task_id]))
    const [deleteReminder, isDeletingReminder,] = useFetching(async () => {
        return await TaskManagementApi.deleteReminder(newReminderTmp._id)
    }, [])

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

    useEffect(() => {
        const fetchReminder = async () => {
            let res = await fetchThisReminder(thisHomework.home_task_id)
            if (!res) return
            setIsPrevReminder(!res.errors)
            if (res.errors) {
                setNewReminderTmp({
                    days: [],
                    text: "",
                    hour: "",
                    min: "",
                })
            } else {
                setNewReminderTmp(res.data)
                setRemindForm(true)
            }

        }
        fetchReminder()
    }, [])

    useEffect(() => {
        setSubject(options.filter(option => option.value === thisHomework.lesson_id)[0]
            ?
            options.filter(option => option.value === thisHomework.lesson_id)[0]
            :
            { label: '', value: '' })
    }, [options])

    useEffect(() => {
        thisHomework.files.files.length && setOldFiles([...oldFiles, ...thisHomework.files.files])
        thisHomework.files.imgs.length && setOldImgs([...oldImgs, ...thisHomework.files.imgs])
    }, [thisHomework.files])

    const createReminderFunc = () => {
        !newReminderTmp.min >= 15 ? setNewReminderTmp({ ...newReminderTmp, min: 30 }) : setNewReminderTmp({ ...newReminderTmp, min: '00' })

        if (name === '' || date === null || description === '' || subject === '' || newReminderTmp.days.length === 0 || newReminderTmp.min === 0 || newReminderTmp.hour === 0 || !newReminderTmp.text === '') {
            setStartValidation(true)
        } else {
            patchHomeWork()
                .then(res => {
                    if (res.errors || !res) return
                    if (files.length !== 0 || imgs.length !== 0) {
                        sendFiles(res.data._id)
                            .then(res => {
                                if (!res || res.errors) return
                                setRefetchFiles()
                            })
                    }
                    if (isPrevReminder) {
                        patchReminder()
                            .then(res => {
                                if (res.errors || !res) return
                                setHomeworksModal(false)
                                setHasUpdated()
                                setHide(true)
                            })
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
            patchHomeWork()
                .then(res => {
                    if (res.errors || !res) return
                    if (files.length !== 0 || imgs.length !== 0) {
                        sendFiles(res.data._id)
                            .then(res => {
                                if (!res || res.errors) return
                                setRefetchFiles()
                            })
                    }
                    setHasUpdated()
                    setHomeworksModal(false)
                    if (newReminderTmp._id) {
                        deleteReminder()
                    }
                })
        }

    }

    const handleSubmit = () => {
        !remindForm ? createHomeworkFunc() : createReminderFunc()
        setHide(true)
        setHomeworksModal(false)
    }

    useLayoutEffect(() => {
        if (homeworks) {
            gsap.to(".modal-hometasks", { opacity: 1, zIndex: 10000, duration: 0.15 })
            setTimeout(() => setHide(false), 200)
        } else {
            gsap.to(".modal-hometasks", { opacity: 0, zIndex: -10, duration: 0.15 })
            setTimeout(() => setHide(true), 200)
        }
    }, [homeworks]);

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

    const deleteOldFile = (index_to_delete, url) => {
        setOldFiles(oldFiles.filter((file, index) => index !== index_to_delete))
        deleteFiles(url)
            .then(res => {
                if (!res || res.errors) return
                setRefetchFiles()
            })
    }

    const deleteOldImg = (e, index_to_delete, url) => {
        e.preventDefault()
        setOldImgs(oldImgs.filter((img, index) => index !== index_to_delete))
        deleteFiles(url)
            .then(res => {
                if (!res || res.errors) return
                setRefetchFiles()
            })
    }

    const getSrc = (file) => URL.createObjectURL(file)

    return (
        <>
            {imageModalOpen && <ImageModal images={imgModal} setOpen={setImageModalOpen} imgIndex={index} />}
            <div className="modalWindow">
                <ModalHeader
                    showModal={() => setHomeworksModal(false)}
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
                        className={isMobile ? "input__simple-input_light" : "input__simple-input_dark"}
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

                    {isMobile &&
                        <div className="field">
                            <input
                                type="file"
                                multiple
                                hidden
                                ref={inputRef}
                                onChange={(e) => uploadFile(e.target)}
                            />
                            {oldFiles.length !== 0 &&
                                oldFiles.map((file, index) => {
                                    return <FileCard
                                        key={index}
                                        index={index}
                                        name={file.name ? file.name : file.filename}
                                        url={file?.url ? file.url : '#'}
                                        hometask_id={thisHomework.hometask_id}
                                        deleteFile={deleteOldFile}
                                        isDownload={true}
                                    />
                                })
                            }
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
                                                        onClick={() => { setImgModal([...imgs]); setIndex(oldFiles.length - 1 + +index); setImageModalOpen(true) }}
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
                            {oldFiles.length !== 0 &&
                                oldFiles.map((file, index) => {
                                    return <FileCard
                                        key={index}
                                        index={index}
                                        name={file.name ? file.name : file.filename}
                                        url={file?.url ? file.url : '#'}
                                        hometask_id={thisHomework.hometask_id}
                                        deleteFile={deleteOldFile}
                                        isDownload={true}
                                    />
                                })
                            }
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
                                                        onClick={() => { setImgModal([...imgs]); setIndex(oldImgs.length - 1 + +index); setImageModalOpen(true) }}
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
                        uploadFunction={(e) => uploadFile(e.target)}
                        inputRef={inputRef}
                        type={'Домашнее задание'}
                    />
                </div>
            </div>
        </>
    );
};

export default PatchHomeworksModal;
