import MediaUnit from "features/MediaUnit/ui/MediaUnit";
import "./ProjectLinksModal.scss"
import { Input } from "shared/ui/Input";
import { useState, useCallback, useEffect, useRef, lazy } from "react";
import useFetching from "shared/hooks/useFetching";
import UniversityApi from 'shared/api/UniversityApi'
import { Select } from "widgets/Select";
import jwtDecode from "jwt-decode";
import KnowlegeBaseApi from "shared/api/KnowlegeBaseApi";
import { Scrollbar } from "react-scrollbars-custom";
import { classNames } from "shared/lib/classNames";
import { ModalHeader } from "shared/ui/ModalHeader/ui/ModalHeader";
import { ModalFooter } from "shared/ui/ModalFooter/ui/ModalFooter";
import Download from "shared/assets/img/download.svg"
import { FileCard } from "shared/ui/FileCard";
import 'widgets/KwonlegeBaseFilter/ui/knowlegeBaseFilter.scss';

const ProjectLinksModal = ({ setOpasity, closeModal, project_id, isMobile = false }) => {
  const id = jwtDecode(localStorage.token).faculty_id
  const [startValidation, setStartValidation] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const typeOptions = [{ label: "Билеты", value: 'Билеты' }, { label: "Конспекты", value: 'Конспекты' }, { label: "Задания", value: 'Задания' }, { label: "Литература", value: 'Литература' }, { label: "Другое", value: 'Другое' }]
  const [type, setType] = useState({})
  const [teacherOptions, setTeacherOptions] = useState([])
  const [teacher, setTeacher] = useState({})
  const [subjectOptions, setSubjectOptions] = useState([])
  const [subject, setSubject] = useState({})
  const [gradeOptions, setGradeOptions] = useState([])
  const [grade, setGrade] = useState({})
  const [semesterOptions, setSemesterOptions] = useState([])
  const [semester, setSemester] = useState({})
  const [enableSemester, setEnableSemester] = useState(false)
  const [isDrag, setIsDrag] = useState(false)
  const [files, setFiles] = useState([])
  const [link, setLink] = useState('')
  const [itemId, setItemId] = useState(id)
  const [myFaculty, setFaculty] = useState(false)

  const [teachersSearch, setTeachersSearch] = useState('')
  const [subjectsSearch, setSubjectsSearch] = useState('')
  const inputRef = useRef()


  const [refetchMedias, setRefetchMedias] = useState(false)
  const [projectMedias, setProjectMedias] = useState([])

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
    return await KnowlegeBaseApi.createDocument({ origin: 'Ссылка', name: name, description: description, url: linkArg, grade: grade?.value?.number, semester: semester?.value, teacher: teacher?.value?.name, subject: subject?.value?.name, type: type.value, isPublic: isPublic, project_id: project_id })
  })
  const [sendFiles] = useFetching(async () => {
    return await KnowlegeBaseApi.sendFiles(files)
  })
  const [getProjectFiles] = useFetching(async () => {
    return await KnowlegeBaseApi.getProjectDocuments(project_id, 'Ссылка', 0, 5)
  })
  const handleSubmit = () => {

    if (name === '' || description === '' || (files.length === 0 && link === '')) {
      setStartValidation(true)
    } else {
      if (files.length !== 0) {
        sendFiles()
          .then(res => {
            if (!res || res.errors) return
            createDocument(res.data)
              .then(res => {
                if (!res || res.error) return

              })
          })
      } else {
        createDocument(link)
          .then(res => {
            if (!res || res.error) return
          })
      }

      closeModalFunc()
    }
  }

  useEffect(() => {
    getProjectFiles()
      .then(res => {
        if (!res || res.errors) return
        setProjectMedias([...res.data])
      })
  }, [])

  useEffect(() => {
    fetchGrades()
      .then(res => {
        if (!res || res.errors) return
        setGradeOptions([{ label: 'Любой курс', value: 0 }, ...res.data.map(option => ({ label: `${option.number} курс `, value: { id: option.id, number: option.number } }))])
      })
  }, [])

  useEffect(() => {
    fetchTeachers({ itemId: itemId, name: teachersSearch })
      .then(res => {
        if (!res || res.errors) return
        setTeacherOptions([{ label: 'Любой преподаватель', value: null }, ...res.data.map(teacher => (
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
        setSubjectOptions([{ label: 'Любой предмет', value: 'null' }, ...res.data.map(subject => (
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
      setSemesterOptions([{ label: 'Любой семестр', value: 0 }])
      setEnableSemester(true)
    } else {
      setSemesterOptions([{ label: `${(grade.value.number - 1) * 2 + 1} семестр `, value: (grade.value.number - 1) * 2 + 1 }, { label: `${(grade.value.number - 1) * 2 + 2} семестр `, value: (grade.value.number - 1) * 2 + 2 }])
      setEnableSemester(true)
    }
  }, [grade])

  const closeModalFunc = () => {
    closeModal()
    setOpasity(false)
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
    setFiles([...files, ...currentTarget.files])
  }
  const deleteFile = (index_to_delete) => {
    setFiles(files.filter((file, index) => index !== index_to_delete))
  }
  return (
    <div className='modalWindow modalWindow_light'>
      <ModalHeader showModal={() => closeModalFunc()} title='Добавление' />
      <div className='modalWindow__content'>
        <div className="projectMediaModal__mediaList">
          {projectMedias.length !== 0
            ?
            <Scrollbar
              style={{ height: `${projectMedias.length * 65}px`, maxHeight: 190 }}
              disableTrackYWidthCompensation={true}
              trackYProps={{ style: { width: "4px", background: "transparent", marginRight: -3, } }}
              thumbYProps={{ style: { background: "#979797", minHeight: "50px", maxHeight: "50px", opacity: 0.5, color: "white" } }}
              trackXProps={{ style: { width: "4px", background: "transparent", marginRight: 5 } }}
              thumbXProps={{ style: { background: "#687074", maxHeight: "100%", opacity: 0 } }}
            >
              {projectMedias.map(media => <MediaUnit media={media} key={media._id} setRefetch={setRefetchMedias} refetch={refetchMedias} isFile={'файл'} isMobile={isMobile} />)}
            </Scrollbar>
            :
            <div className="emptyList__title_noBorder">Нету файлов</div>
          }
        </div>
        <div className="knowlegeBase-filters__content">
          <Input
            className={"input__simple-input_light"}
            type="text"
            placeholder="https://..."
            value={link}
            setValue={(e) => setLink(e.target.value)}
            validation={link === '' && startValidation}
            validationText="Это поле должно быть заполнено"
          />
          <Input
            className={"input__simple-input_light"}
            type="text"
            placeholder="Название"
            value={name}
            setValue={(e) => setName(e.target.value)}
            validation={name === '' && startValidation}
            validationText="Это поле должно быть заполнено"
          />
          <Input
            className={"input__textarea_light"}
            type="textarea"
            placeholder="Описание"
            value={description}
            setValue={(e) => setDescription(e.target.value)}
            validation={description === '' && startValidation}
            validationText="Это поле должно быть заполнено"
          />
          <div className="knowlegeBase-filters__row">
            <div className={"field field_light"}>
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
            <div className={"field field_light"}>
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
            <div className={"field field_light"}>
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
          <div className={"field field_light"}>
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
          <div className={"field field_light"}>
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
          <ModalFooter
            isMobile={isMobile}
            submitFunction={() => handleSubmit()}
            publicSwitcher={true}
            isPublic={isPublic}
            setIsPublic={setIsPublic}
            myFaculty={myFaculty}
            setFaculty={setFaculty}
            isDark={isMobile}
            uploadFunction={(e) => uploadFile(e.target)}
            inputRef={inputRef}
            knbSwitcher={true}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectLinksModal;
