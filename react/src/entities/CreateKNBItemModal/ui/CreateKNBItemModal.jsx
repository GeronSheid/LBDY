import jwtDecode from 'jwt-decode'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import KnowlegeBaseApi from 'shared/api/KnowlegeBaseApi'
import UniversityApi from 'shared/api/UniversityApi'
import useFetching from 'shared/hooks/useFetching'
import { classNames } from 'shared/lib/classNames'
import { Input } from 'shared/ui/Input'
import { ModalFooter } from 'shared/ui/ModalFooter/ui/ModalFooter'
import { ModalHeader } from 'shared/ui/ModalHeader/ui/ModalHeader'
import { Select } from 'widgets/Select'
import Download from "shared/assets/img/download.svg"
import { FileCard } from 'shared/ui/FileCard'
import 'widgets/KwonlegeBaseFilter/ui/knowlegeBaseFilter.scss';

import Spiner from "shared/assets/img/spinner.svg"

export const CreateKNBItemModal = ({ showModal, setShowModal, isMobile, setRefetch, refetch, setErrorAlert}) => {
  const id = jwtDecode(localStorage.token).faculty_id
  const [startValidation, setStartValidation] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const [dataType, setDataType] = useState({ label: 'Файл', value: 'файл' })
  const [link, setLink] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('Другое')
  const [grade, setGrade] = useState({})
  const [gradeOptions, setGradeOptions] = useState([])
  const [semester, setSemester] = useState({})
  const [semesterOptions, setSemesterOptions] = useState([])
  const [enableSemester, setEnableSemester] = useState(false)
  const [teacher, setTeacher] = useState({})
  const [teacherOptions, setTeacherOptions] = useState([])
  const [subject, setSubject] = useState({})
  const [subjectOptions, setSubjectOptions] = useState([])
  const [isDrag, setIsDrag] = useState(false)
  const [files, setFiles] = useState([])
  const [itemId, setItemId] = useState(id)
  const [myFaculty, setFaculty] = useState(false)
  const [teachersSearch, setTeachersSearch] = useState('')
  const [subjectsSearch, setSubjectsSearch] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const dataOptions = [{ label: 'Файл', value: 'файл' }, { label: 'Ссылка', value: 'ссылка' }]
  const typeOptions = [{ label: "Билеты", value: 'Билеты' }, { label: "Конспекты", value: 'Конспекты' }, { label: "Задания", value: 'Задания' }, { label: "Литература", value: 'Литература' }, { label: "Другое", value: 'Другое' }]
  const inputRef = useRef()

  const [fetchGrades, gradesLoading] = useFetching(useCallback(async () => {
    return await UniversityApi.getGrades(id)
  }, []))
  const [fetchTeachers, teachersLoading] = useFetching(useCallback(async (data) => {
    return await UniversityApi.getTeachers(data.itemId, data.name)
  }, []))
  const [fetchSubjects, subjectsLoading] = useFetching(useCallback(async (data) => {
    return await UniversityApi.getSubjects(data.itemId, data.name)
  }, []))
  const [createDocument] = useFetching(async (linkArg) => {
    return await KnowlegeBaseApi.createDocument({ origin: dataType.label, name: name, description: description, url: linkArg, grade: grade?.value?.number, semester: semester?.value, teacher: teacher?.value?.name, subject: subject?.value?.name, type: type.value, isPublic: isPublic })
  })
  const [sendFiles, fileIsLoading] = useFetching(async () => {
    return await KnowlegeBaseApi.sendFiles(files)
  })

  const handleSubmit = () => {

    if (name === '' || description === '' || (files.length === 0 && link === '')) {
      setStartValidation(true)
    } else {
      if (files.length !== 0) {
        sendFiles()
          .then(res => {
            if (!res || res.errors) {
              setShowModal(false)
              setErrorAlert(true)
              return
            }
            setIsLoaded(true)
            createDocument(res.data)
              .then(res => {
                if (!res || res.error) return
                setRefetch(prev => prev * Math.random())
              })
          })
      } else {
        createDocument(link)
          .then(res => {
            if (!res || res.error) return
            setRefetch(prev => prev * Math.random())
          })
      }
      
      if(fileIsLoading !== true && isLoaded === true ) {
        
      }
    }
  }

  useEffect(() => {
    fetchGrades()
      .then(res => {
        if (!res || res.errors) return
        setGradeOptions([{label: 'Любой курс' , value: 0 }, ...res.data.map(option => ({ label: `${option.number} курс `, value: { id: option.id, number: option.number } }))])
      })
  }, [])

  useEffect(() => {
    fetchTeachers({ itemId: itemId, name: teachersSearch })
      .then(res => {
        if (!res || res.errors) return
        setTeacherOptions([{label: 'Любой преподаватель', value: null}, ...res.data.map(teacher => (
          {
            label: `${teacher.middle_name} ${teacher.first_name} ${teacher.last_name}`,
            value: { id: teacher.id, name: `${teacher.middle_name} ${teacher.first_name} ${teacher.last_name}` }
          }
        ))])
      })
  }, [teachersSearch, itemId])

  useEffect(() => {
    fetchSubjects({ itemId: itemId, name: subjectsSearch })
      .then(res => {
        if (!res || res.errors) return
        setSubjectOptions([{label: 'Любой предмет', value: 'null'}, ...res.data.map(subject => (
          {
            label: subject.name,
            value: { name: subject.name, id: subject.id }
          }
        ))])
      })
  }, [subjectsSearch, itemId])

  useEffect(() => {
    if (!myFaculty) {
      setItemId(id)
    } else {
      setItemId(null)
    }
  }, [myFaculty])

  useEffect(() => {
    if (grade.value === undefined) return
    if (grade.value === 0) {
      setSemesterOptions([{label: 'Любой семестр', value: 0}])
      setEnableSemester(true)
    } else {
      setSemesterOptions([{ label: `${(grade.value.number - 1) * 2 + 1} семестр `, value: (grade.value.number - 1) * 2 + 1 }, { label: `${(grade.value.number - 1) * 2 + 2} семестр `, value: (grade.value.number - 1) * 2 + 2 }])
      setEnableSemester(true)
    }
  }, [grade])

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
    setFiles([...files, ...currentTarget.files])
  }

  const deleteFile = (index_to_delete) => {
    setFiles(files.filter((file, index) => index !== index_to_delete))
  }


  useEffect(() => {
    if(!fileIsLoading && isLoaded) setShowModal(false)
  }, [fileIsLoading])

  return (
    <div className='modalWindow'>
      <ModalHeader showModal={() => setShowModal(!showModal)} title='Добавление' />
      <div className='modalWindow__content'>
        {fileIsLoading
          ?
          <div className='modalWindow__processingContent'>
            <Spiner />
            <b>Происходит загрузка на сервер</b>
          </div>
          :
          <>
             <div className="knowlegeBase-filters__content">
          <div className={isMobile ? "field field_light" : "field field_dark"}>
            <Select
              placeholder='Файл или ссылка'
              optionsType='default'
              options={dataOptions}
              chooseOption={dataType}
              setChooseOption={(e) => setDataType(e)}
              validation={dataType === '' && startValidation}
              validationText="Надо что-то выбрать"
            />
          </div>
          {dataType.value === 'ссылка' &&
            <Input
              className={isMobile ? "input__simple-input_light" : "input__simple-input_dark"}
              type="text"
              placeholder="https://..."
              value={link}
              setValue={(e) => setLink(e.target.value)}
              validation={link === '' && startValidation}
              validationText="Это поле должно быть заполнено"
            />
          }
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
          {(dataType.value === 'файл' && !isMobile) &&
            <div className={isMobile ? "field field_light" : "field field_dark"}>
              {files.length === 0 &&
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
            </div>
          }
          <div className="knowlegeBase-filters__row">
            <div className={isMobile ? "field field_light" : "field field_dark"}>
              <Select
                placeholder='Курс'
                optionsType='default'
                options={gradeOptions}
                chooseOption={grade}
                setChooseOption={(e) => setGrade(e)}
                validation={grade === null && startValidation}
                validationText="Надо что-то выбрать"
              />
            </div>
            <div className={isMobile ? "field field_light" : "field field_dark"}>
              <Select
                placeholder='Семестр'
                optionsType='default'
                options={semesterOptions}
                chooseOption={semester}
                setChooseOption={(e) => setSemester(e)}
                validation={semester === null && startValidation}
                disabled={!enableSemester}
                validationText="Надо что-то выбрать"
              />
            </div>
            <div className={isMobile ? "field field_light" : "field field_dark"}>
              <Select
                placeholder='Тип'
                optionsType='default'
                options={typeOptions}
                chooseOption={type}
                setChooseOption={(e) => setType(e)}
                validation={type === null && startValidation}
                validationText="Выберите тип"
              />
            </div>
          </div>
          <div className={isMobile ? "field field_light" : "field field_dark"}>
            <Select
              placeholder='Предмет'
              optionsType='with-search'
              options={subjectOptions}
              chooseOption={subject}
              setChooseOption={(e) => setSubject(e)}
              validation={subject === '' && startValidation}
              validationText="Надо что-то выбрать"
              textSearch={subjectsSearch}
              setTextSearch={setSubjectsSearch}
            />
          </div>
          <div className={isMobile ? "field field_light" : "field field_dark"}>
            <Select
              placeholder='Преподаватель'
              optionsType='with-search'
              options={teacherOptions}
              chooseOption={teacher}
              setChooseOption={(e) => setTeacher(e)}
              validation={teacher === null && startValidation}
              validationText="Надо что-то выбрать"
              textSearch={teachersSearch}
              setTextSearch={setTeachersSearch}
            />
          </div>
        </div>
        <div className='modalWindow__row'>
          {isMobile &&
            <div className="field">
              <input
                type="file"
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
            </div>
          }
          <ModalFooter
            isMobile={isMobile}
            submitFunction={() => handleSubmit()}
            publicSwitcher={true}
            isPublic={isPublic}
            setIsPublic={setIsPublic}
            myFaculty={myFaculty}
            setFaculty={setFaculty}
            isDark={!isMobile}
            uploadFunction={(e) => uploadFile(e.target)}
            inputRef={inputRef}
            knbSwitcher={true}
            file={files}
            type={dataType.value}
          />
        </div>
          </>
        }
      </div>
    </div>
  )
}
