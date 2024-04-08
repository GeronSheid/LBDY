import jwtDecode from 'jwt-decode';
import React, { useCallback, useEffect, useState } from 'react';
import UniversityApi from 'shared/api/UniversityApi';
import useFetching from 'shared/hooks/useFetching';
import { Input } from 'shared/ui/Input';
import 'widgets/KwonlegeBaseFilter/ui/knowlegeBaseFilter.scss';
import { Select } from 'widgets/Select';
import SearchIcon from 'shared/assets/img/search-icon.svg';
import useWindow from 'shared/hooks/useWindow';
import { ModalWrapper } from 'shared/ui/ModalWrapper';
import { ModalHeader } from "shared/ui/ModalHeader/ui/ModalHeader";
import { ModalFooter } from "shared/ui/ModalFooter/ui/ModalFooter";

export const KnowlegeBaseFilter = ({ getQuerryParams, isMobile, openSearchModal, setOpenSearchModal }) => {
  const id = jwtDecode(localStorage.token).faculty_id

  
  //Stat-ы для управления инпутами и селектами
  const [searchText, setSearchText] = useState('')
  const [grade, setGrade] = useState({})
  const [gradeOptions, setGradeOptions] = useState([])
  const [semester, setSemester] = useState({})
  const [semesterOptions, setSemesterOptions] = useState([])
  const [enableSemester, setEnableSemester] = useState(true)
  const [teacher, setTeacher] = useState({})
  const [teacherOptions, setTeacherOptions] = useState([])
  const [subject, setSubject] = useState({})
  const [subjectOptions, setSubjectOptions] = useState([])
  const [type, setType] = useState({})
  const [teachersSearch, setTeachersSearch] = useState('')
  const [subjectsSearch, setSubjectsSearch] = useState('')

  // const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [itemId, setItemId] = useState(id)
  const [myFaculty, setFaculty] = useState(false)

  const { windowWidth, windowHeight, orientation } = useWindow();
  const isDesktop = windowWidth > 1440 && windowHeight > 960;
  const isTable = windowWidth <= 1440 || windowHeight <= 960;

  const [fetchGrades, gradesLoading] = useFetching(useCallback(async () => {
    return await UniversityApi.getGrades(id)
  }, []))
  const [fetchTeachers, teachersLoading] = useFetching(useCallback(async (data) => {
    return await UniversityApi.getTeachers(data.itemId, data.name)
  }, []))
  const [fetchSubjects, subjectsLoading] = useFetching(useCallback(async (data) => {
    return await UniversityApi.getSubjects(data.itemId, data.name)
  }, []))
  useEffect(() => {
    fetchGrades()
      .then(res => {
        if (!res || res.errors) return
        setGradeOptions([{label: 'Любой курс', value: 0}, ...res.data.map(option => (
          {
            label: `${option.number} курс `,
            value: { id: option.id, number: option.number }
          }
        ))])
      })
  }, [])

  useEffect(() => {
    if(!myFaculty) {
      setItemId(id)
    } else {
      setItemId(null)
    }
  }, [myFaculty])

  useEffect(() => {
    fetchTeachers({itemId: itemId, name: teachersSearch})
      .then(res => {
        if (!res || res.errors) return
        setTeacherOptions([{label: 'Любой преподаватель', value: null },...res.data.map(teacher => (
          {
            label: `${teacher.middle_name} ${teacher.first_name} ${teacher.last_name}`,
            value: { id: teacher.id, name: `${teacher.middle_name} ${teacher.first_name} ${teacher.last_name}` }
          }
        ))])
      })
  }, [teachersSearch, itemId])

  useEffect(() => {
    fetchSubjects({itemId: itemId, name: subjectsSearch})
      .then(res => {
        if (!res || res.errors) return
        setSubjectOptions([{label: 'Любой предмет', value: null},...res.data.map(subject => (
          {
            label: subject.name,
            value: { name: subject.name, id: subject.id }
          }
        ))])
      })
  }, [subjectsSearch, itemId])

  useEffect(() => {
    if (grade.value === undefined) return
    setSemesterOptions(grade.value === 0 ? [{label: 'Любой семестр', value: 0}] : [{ label: `${(grade.value.number - 1) * 2 + 1} семестр `, value: (grade.value.number - 1) * 2 + 1 }, { label: `${(grade.value.number - 1) * 2 + 2} семестр `, value: (grade.value.number - 1) * 2 + 2 }])
  }, [grade])
  
  const options = [{ label: "Билеты", value: 'Билеты' }, { label: "Конспекты", value: 'Конспекты' }, { label: "Задания", value: 'Задания' }, { label: "Литература", value: 'Литература' }, { label: "Другое", value: 'Другое' }]
  return (
    <>
      {openSearchModal &&
        <ModalWrapper>
          <div className='knowlegeBase-filters__searchModal modalWindow_light'>
            <ModalHeader title={'Расширенный поиск'} showModal={() => setOpenSearchModal(false)}/>
            <div className='modalWindow__content'>
              <div className="knowlegeBase-filters__content">           
                <div className="knowlegeBase-filters__row">
                  <Select
                    placeholder={"Курс"}
                    optionsType="default"
                    options={gradeOptions}
                    chooseOption={grade}
                    setChooseOption={(e) => { setGrade(e); setEnableSemester(false); setSemester({}) }}
                    // validation={subject === '' && startValidation}
                    // disabled={enableSelect}
                    validationText="Выбери пару"
                    isSmall={true}
                  />
                  <Select
                    placeholder={"Семестр"}
                    optionsType="default"
                    options={semesterOptions}
                    chooseOption={semester}
                    setChooseOption={(e) => setSemester(e)}
                    // validation={subject === '' && startValidation}
                    disabled={enableSemester}
                    validationText="Выбери пару"
                    isSmall={true}
                  />
                  <Select
                    placeholder={"Тип"}
                    optionsType="default"
                    options={options}
                    chooseOption={type}
                    setChooseOption={(e) => setType(e)}
                    // validation={subject === '' && startValidation}
                    // disabled={enableSelect}
                    validationText="Выбери пару"
                    isSmall={true}
                  />
                </div>
                  <Select
                    placeholder={"Предмет"}
                    optionsType="with-search"
                    options={subjectOptions}
                    chooseOption={subject}
                    setChooseOption={(e) => setSubject(e)}
                    // validation={subject === '' && startValidation}
                    // disabled={enableSelect}
                    validationText="Выбери пару"
                    isSmall={true}
                    textSearch={subjectsSearch}
                    setTextSearch={setSubjectsSearch}
                  />
                  <Select
                    placeholder={"Преподаватель"}
                    optionsType="with-search"
                    options={teacherOptions}
                    chooseOption={teacher}
                    setChooseOption={(e) => setTeacher(e)}
                    // validation={subject === '' && startValidation}
                    // disabled={enableSelect}
                    validationText="Выбери пару"
                    isSmall={true}
                    textSearch={teachersSearch}
                    setTextSearch={setTeachersSearch}
                  />
                  <div className="knowlegeBase-filters__row knowlegeBase-filters__row_full-row knowlegeBase-filters__row_search-icon">
                  <Input
                    className="input__simple-input_light"
                    placeholder={"Поиск"}
                    setValue={(e) => setSearchText(e.target.value)}
                  />
                  <SearchIcon />
                </div>
              </div>
              <ModalFooter
                submitFunction={() => {
                  getQuerryParams({
                    search: searchText,
                    grade: (grade.value !== false || grade.value === 0) ? grade.value : '',
                    semester: semester.value ? semester.value : '',
                    teacher: teacher?.value ? teacher.value.name : '',
                    subject: subject?.value ? subject.value : '',
                    type: type.value ? type.value : ''
                  });
                  setOpenSearchModal(false)
                }}
                knbSwitcher={true}
                myFaculty={myFaculty}
                setFaculty={setFaculty}
                isDark={false}
                isMobile={isMobile}
                btnText='Поиск'
              />
            </div>
          </div>
        </ModalWrapper>
      }
      {!isMobile &&
        <div className="knowlegeBase__filters knowlegeBase-filters plate">
        <div className="knowlegeBase-filters__header">
          <legend className="legend">Фильтры</legend>
        </div>
        {isDesktop &&
          <div className="knowlegeBase-filters__content">
            <div className="knowlegeBase-filters__row knowlegeBase-filters__row_full-row knowlegeBase-filters__row_search-icon">
              <Input
                className="input__simple-input_light input__simple-input_small"
                placeholder={"Поиск"}
                setValue={(e) => setSearchText(e.target.value)}
                isSmall={true}
              />
              <SearchIcon />
            </div>
            <div className="knowlegeBase-filters__row">
              <Select
                placeholder={"Курс"}
                optionsType="default"
                options={gradeOptions}
                chooseOption={grade}
                setChooseOption={(e) => { setGrade(e); setEnableSemester(false); setSemester({}) }}
                // validation={subject === '' && startValidation}
                // disabled={enableSelect}
                validationText="Выбери пару"
                isSmall={true}
              />
              <Select
                placeholder={"Семестр"}
                optionsType="default"
                options={semesterOptions}
                chooseOption={semester}
                setChooseOption={(e) => setSemester(e)}
                // validation={subject === '' && startValidation}
                disabled={enableSemester}
                validationText="Выбери пару"
                isSmall={true}
              />
              <Select
                placeholder={"Тип"}
                optionsType="default"
                options={options}
                chooseOption={type}
                setChooseOption={(e) => setType(e)}
                // validation={subject === '' && startValidation}
                // disabled={enableSelect}
                validationText="Выбери пару"
                isSmall={true}
              />
            </div>
            <div className="knowlegeBase-filters__row">
              <button className='btn-text__service-gray' onClick={() => setOpenSearchModal(true)}>
                Расширенный поиск
              </button>
              <button
                className="btn-shape__filled"
                onClick={() => {
                  setOpenSearchModal(false)
                  getQuerryParams({
                    search: searchText,
                    grade: (grade.value !== false || grade.value === 0) ? grade.value : '',
                    semester: semester.value ? semester.value : '',
                    teacher: teacher?.value?.name ? teacher?.value?.name : '',
                    subject: subject?.value ? subject.value : '',
                    type: type.value ? type.value : ''
                  });
                }}
              >
                Поиск
              </button>
            </div>
          </div>
        }
        {isTable &&
          <div className="knowlegeBase-filters__content">
            <div className="knowlegeBase-filters__row knowlegeBase-filters__row_full-row knowlegeBase-filters__row_search-icon">
              <Input
                className="input__simple-input_light input__simple-input_small"
                placeholder={"Поиск"}
                setValue={(e) => setSearchText(e.target.value)}
                isSmall={true}
              />
              <SearchIcon />
            </div>
            <div className="knowlegeBase-filters__row">
              
              <button className='btn-text__service-gray' onClick={() => setOpenSearchModal(true)}>
                Расширенный поиск
              </button>
              <button
                className="btn-shape__filled"
                onClick={() => {
                  getQuerryParams({
                    search: searchText,
                    grade: grade.value ? grade.value : '',
                    semester: semester.value ? semester.value : '',
                    teacher: teacher.value ? teacher.value.name : '',
                    subject: subject.value ? subject.value : '',
                    type: type.value ? type.value : ''
                  });
                  setOpenSearchModal(false);
                }}
              >
                  Поиск
              </button>
            </div>
          </div>
        }
      </div> 
      }
    </>
  )
}
