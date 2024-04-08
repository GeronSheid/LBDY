import React, { useCallback, useEffect, useState } from 'react'
import 'pages/KnowlegeBasePage/ui/sass/knowlegeBase.scss'
import useFetching from 'shared/hooks/useFetching'
import KnowlegeBaseApi from 'shared/api/KnowlegeBaseApi'
import { KnowlegeBaseItem } from 'shared/ui/KnowlegeBaseItem'
import { FilterIndicator } from 'shared/ui/FilterIndicator/ui/FilterIndicator'
import { useInView } from 'react-intersection-observer'
import { Scrollbar } from 'react-scrollbars-custom'
import { ModalWrapper } from 'shared/ui/ModalWrapper/ui/ModalWrapper'
import { CreateKNBItemModal } from 'entities/CreateKNBItemModal'
import Spiner from "shared/assets/img/spinner.svg"
import Properties from 'shared/assets/img/properties.svg';
import { MobileTab } from 'shared/ui/MobileTab'

const KnowlegeBase = ({ querryParams, isMobile, setOpenSearchModal, openSearchModal }) => {
    const limit = 25
    const grade = querryParams.grade !== undefined ? ((querryParams.grade === 0 || querryParams !== false) ? querryParams.grade.number !== undefined ? querryParams.grade.number : querryParams.grade : false) : '';
    const semester = querryParams.semester !== undefined ? querryParams.semester : '';
    const teacher = querryParams.teacher !== undefined ? querryParams.teacher : '';
    const subject = querryParams.subject !== undefined ? querryParams.subject?.name : '';
    const [documents, setDocuments] = useState([])
    const [refetchDocuments, setRefetchDocuments] = useState(1)
    const [direction, setDirection] = useState(false)
    const [sortType, setSortType] = useState('')
    const [isPublic, togglePublic] = useState(true)
    const [modalVisible, setModalVisible] = useState(false)
    const [skip, setSkip] = useState(0)
    const { ref, inView } = useInView()
    const [stopLoading, setStopLoading] = useState(false)
    const [errorAlert, setErrorAlert] = useState(false)
    const [getDocuments, documentsLoading] = useFetching(useCallback(async ({ isPublic, skip }) => {
        return await KnowlegeBaseApi.getDocuments(isPublic, skip, limit, querryParams.search, grade, semester, teacher, subject, querryParams.type)
    }, [isPublic, skip, limit, querryParams.search, grade, semester, teacher, subject, querryParams.type]))

    const sortClickHandler = (string, callback, param) => {
        if (sortType === string) {
            setDirection(!direction)
            callback(param)
        } else {
            setSortType(string)
            callback(true)
        }
    }
    //--------- Обработчик сортировки -------------------------------------------------------------------------------------------------------------------------------------------------------

    const sortHandler = (toSortArr) => {
        var result
        if (!toSortArr || toSortArr.errors) return []
        if (sortType === '') {
            result = toSortArr
        }
        if (sortType === 'Название') {
            result = toSortArr.sort((a, b) => direction ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name))
        }
        if (sortType === 'Курс') {
            result = toSortArr.sort((a, b) => direction ? b.grade - a.grade : a.grade - b.grade);
        }
        if (sortType === 'Семестр') {
            result = toSortArr.sort((a, b) => direction ? b.semester - a.semester : a.semester - b.semester);
        }
        if (sortType === 'Преподаватель') {
            result = toSortArr.sort((a, b) => direction ? (b.teacher === null ? ''.localeCompare(a.teacher) : b.teacher.localeCompare(a.teacher)) : (a.teacher === null ? ''.localeCompare(b.teacher) : a.teacher.localeCompare(b.teacher)))
        }
        if (sortType === 'Предмет') {
            result = toSortArr.sort((a, b) => direction ? (b.subject === null ? ''.localeCompare(a.subject) : b.subject.localeCompare(a.subject)) : (a.teacher === null ? ''.localeCompare(b.subject) : a.subject.localeCompare(b.subject)))
        }
        if (sortType === 'Тип') {
            result = toSortArr.sort((a, b) => direction ? b.type.localeCompare(a.type) : a.type.localeCompare(b.type))
        }
        if (sortType === 'Дата загрузки') {
            result = toSortArr.sort((a, b) => {
                const dateA = new Date(a.created_at).getTime();
                const dateB = new Date(b.created_at).getTime();
                return direction ? dateB - dateA : dateA - dateB;
            })
        }
    
        return result
    };


    //--------- Запрос и подгрузка элементов базы знаний ------------------------------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        setSkip(0)
    }, [querryParams])

    useEffect(() => {
        if (skip === 0) {
            getDocuments({ isPublic, skip })
                .then(res => {
                    if (!res || res.errors) return
                    if (res.data.length === 0) {
                        setStopLoading(true)
                    }
                    setDocuments(sortHandler(res.data))
                })
        }
    }, [isPublic, skip, querryParams])

    useEffect(() => {
        if (inView) setSkip(prev => prev + 25)
    }, [inView])

    useEffect(() => {
        if (inView && !documentsLoading && !stopLoading) {
            getDocuments({ isPublic, skip })
                .then(res => {
                    if (!res || res.errors) return
                    if (res.data.length === 0) {
                        setStopLoading(true)
                    }
                    setDocuments(prevDocs => sortHandler([...prevDocs, ...res.data]))
                })
        }
    }, [skip, refetchDocuments])

    useEffect(() => {
        setDocuments(prev => sortHandler([...prev]))
    }, [direction, sortType])

    useEffect(() => {
        getDocuments({isPublic, skip: 0})
            .then(res => {
                if (!res || res.errors) return
                setDocuments([])
                setDocuments(prevDocs => sortHandler([...prevDocs, ...res.data]))
            })
    }, [refetchDocuments])
    //------------------------------------------------------------------------------------------------------------------------------------------------------


    return (
        <>
            {modalVisible &&
                <ModalWrapper>
                    <CreateKNBItemModal 
                        showModal={modalVisible} 
                        setShowModal={() => setModalVisible(!modalVisible)} 
                        setErrorAlert={setErrorAlert}
                        isMobile={isMobile} 
                        refetch={refetchDocuments} 
                        setRefetch={setRefetchDocuments} />
                </ModalWrapper>
            }
            {errorAlert &&
                <ModalWrapper>
                    <div className={isMobile ? "modalWindow modalWindow_light" : "modalWindow"}>
                        <div className="modalWindow__content modalWindow__content_auth">
                            <div className="modalWindow__title">
                                Ошибка при отправке файла
                            </div>
                            <div className={isMobile ? "modalWindow__text modalWindow__text_center modalWindow__text_dark" : "modalWindow__text modalWindow__text_center"}>
                                Попробуй перезагрузить страницу или напиши нам об ошибке
                            </div>
                            <div className="modalWindow__btn-wrap modalWindow__btn-wrap_auth">
                                <button className='btn-shape__filled' onClick={() => setErrorAlert(false)}>Хорошо</button>
                            </div>
                        </div>
                    </div>
                </ModalWrapper>
            }
            <div className="knowlegeBase__base-info base-info plate">
                {isMobile
                    ?
                    <div className='knowlegeBase__mobile-header'>
                        <div className='knowlegeBase__mobile-btns'>
                            <button 
                                className="btn-shape__add-item" 
                                onClick={() => setModalVisible(true)}></button>
                                <legend className='legend'>Результат</legend>
                            <button 
                                onClick={() => setOpenSearchModal(true)}
                            >
                                <Properties />
                            </button>
                        </div>
                        <MobileTab
                            tab1={'Публичный доступ'}
                            tab2={'Мои файлы'}
                            checked={!isPublic}
                            setChecked={() => {togglePublic(!isPublic); setSkip(0); setDocuments([]); setStopLoading(false);}}
                        />
                        
                    </div>
                    :
                    <div className="base-info__header">
                        <div className="base-info__header-top">
                            <legend className='legend'>Результаты</legend>
                            <div className="base-info__header-controls">
                                <div>
                                    <button className={isPublic ? 'btn-text__tab_dark btn-text__tab_dark_active' : 'btn-text__tab_dark'} onClick={() => { togglePublic(true); if (isPublic !== true) { setSkip(0); setDocuments([]); setStopLoading(false)} }}>Публичный доступ</button>
                                    <button className={isPublic ? 'btn-text__tab_dark' : 'btn-text__tab_dark btn-text__tab_dark_active'} onClick={() => { togglePublic(false); if (isPublic !== false) { setSkip(0); setDocuments([]); setStopLoading(false)} }}>Мои файлы</button>
                                </div>
                                <button className="btn-shape__add-item" onClick={() => setModalVisible(true)}></button>
                            </div>
                        </div>
                        <div className="base-info__header-bottom">
                            <ul className={'base-info__header-filters info-filters knowlegeBase__row'}>
                                <li className="info-filters__item knowlegeBase__row-name">
                                    <FilterIndicator
                                        label='Название'
                                        onClick={sortClickHandler}
                                    />
                                </li>
                                <li className="info-filters__item">
                                    <FilterIndicator
                                        label='Курс'
                                        onClick={sortClickHandler}
                                    />
                                </li>
                                <li className="info-filters__item">
                                    <FilterIndicator
                                        label='Семестр'
                                        onClick={sortClickHandler}
                                    />
                                </li>
                                <li className="info-filters__item">
                                    <FilterIndicator
                                        label='Преподаватель'
                                        onClick={sortClickHandler}
                                    />
                                </li>
                                <li className="info-filters__item knowlegeBase-item__col_subject">
                                    <FilterIndicator
                                        label='Предмет'
                                        onClick={sortClickHandler}
                                    />
                                </li>
                                <li className="info-filters__item">
                                    <FilterIndicator
                                        label='Тип'
                                        onClick={sortClickHandler}
                                    />
                                </li>
                                <li className="info-filters__item">
                                    <FilterIndicator
                                        label='Дата загрузки'
                                        onClick={sortClickHandler}
                                    />
                                </li>
                                <li></li>
                            </ul>
                        </div>
                    </div>
                }
                <Scrollbar
                    disableTrackYWidthCompensation={true}
                    trackYProps={{ style: { width: "4px", background: "transparent", marginRight: -8 } }}
                    thumbYProps={{ style: { background: "#687074", maxHeight: "62px", opacity: 0.5 } }}
                    className='knowlegeBase__scrollbar'
                >
                    {documents.map(document =>
                        <KnowlegeBaseItem
                            key={document._id}
                            props={document}
                            refetchDocuments={refetchDocuments}
                            setRefetchDocuments={setRefetchDocuments}
                            isPublic={isPublic}
                            isMobile={isMobile}
                        />)}
                    {documents.length === 0 && !documentsLoading &&
                        <div className='knowlegeBase__notFound'>
                            <p>Нет подходящих результатов</p>
                        </div>
                    }
                    {documentsLoading &&
                        <div className='knowlegeBase__notFound'>
                            <Spiner style={{ color: '#56a437' }} />
                        </div>
                    }
                    {!documentsLoading && !stopLoading && <div ref={ref} style={{ width: '100%', height: '10px' }}></div>}
                </Scrollbar>
            </div>
        </>
    )
}

export default KnowlegeBase;
