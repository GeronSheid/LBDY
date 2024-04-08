import {Select} from "widgets/Select";
import {useEffect, useState} from "react";
import UserApi from "shared/api/UserApi";
import {REQUIRED_FIELD} from "shared/consts/consts";

const SelectorsGroup = ({
    startValidation = false,
    className = "",
    faculty,
    specialization,
    grade,
    group,
    setFaculty,
    setSpecialization,
    setGrade,
    setGroup,
    setGroupId,
    noGroup = false,
    setId = false
}) => {
    const [faculties, setFaculties] = useState([])
    const [facultiesTextSearch, setFacultiesTextSearch] = useState('')
    const [specializations, setSpecializations] = useState([])
    const [grades, setGrades] = useState([])
    const [groups, setGroups] = useState([])
    const [groupsTextSearch, setGroupsTextSearch] = useState('')

    useEffect(() => {
        UserApi.getFaculties()
            .then(res => {
                setFaculties(res.data)
            })
    }, []);
    
    useEffect(() => {
        if (groups.length !== 0 && group !== "") {
            setGroupId(groups.find(gr => gr.name === group.label).id)
            }
    }, [group]);

    useEffect(() => {
        if (faculties.length !== 0 && faculty !== "") {
            setSpecializations(faculties.find(fac => fac.name === faculty.label).grades)
        }
    }, [faculties, faculty]);

    useEffect(() => {
        if (specializations.length !== 0 && specialization !== "") {
            setGrades(specializations.filter(spec => spec.speciality === specialization.label).map(grade => grade.number))
        }
    }, [specializations, specialization])

    useEffect(() => {
        if (specializations.length !== 0 && grade !== "") {
            const facultyId = faculties.find(fac => fac.name === faculty.label).id
            const gradeId = specializations.find(spec => spec.speciality === specialization.label & spec.number === grade.value.name).id
            UserApi.getGroups(facultyId, gradeId)
                .then(res => {
                    setGroups(res.data)
                })
        }
    }, [specializations, grade]);

    const setSpecializationsArray = () => {
        return specializations.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.speciality === value.speciality
                ))
        ).map(spec => spec.speciality)
    }
    return (
        <>
            <Select
                placeholder={"Факультет"}
                options={faculties.map(fac => ({label: fac.name, value: {name: fac.name, id: fac.id}}))}
                optionsType="with-search"
                chooseOption={faculty}
                setChooseOption={setFaculty}
                textSearch={facultiesTextSearch}
                setTextSearch={setFacultiesTextSearch}
                validation={startValidation && faculty === ""}
                validationText={REQUIRED_FIELD}
                className={className}
                id={setId ? "selectScheduleFaculty" : ""}
            />
            <Select
                placeholder={"Специальность"}
                options={setSpecializationsArray().map((spec, index) => ({label: spec, value: {name: spec, id: index}}))}
                optionsType="default"
                disabled={faculty === ""}
                chooseOption={specialization}
                setChooseOption={setSpecialization}
                validation={startValidation && specialization === ""}
                validationText={REQUIRED_FIELD}
                className={className}
                id={setId ? "selectScheduleSpecialization" : ""}
            />
            <Select
                placeholder={"Курс"}
                options={grades.map(grade => ({label: `${grade} курс`, value: {name: grade, id: grade}}))}
                optionsType="default"
                disabled={specialization === ""}
                chooseOption={grade}
                setChooseOption={setGrade}
                validation={startValidation && grade === ""}
                validationText={REQUIRED_FIELD}
                className={className}
                id={setId ? "selectScheduleGrade" : ""}
            />
            <Select
                placeholder={"Группа"}
                options={groups.map(group => ({label: group.name, value: group.id}))}
                optionsType="with-search"
                disabled={grade === "" || noGroup}
                chooseOption={group}
                textSearch={groupsTextSearch}
                setTextSearch={setGroupsTextSearch}
                setChooseOption={(e) => {setGroup(e); localStorage.setItem('group', JSON.stringify(e))}}
                validation={startValidation && group === "" && !noGroup}
                validationText={REQUIRED_FIELD}
                className={className}
                id={setId ? "selectScheduleGroup" : ""}
            />
        </>
    );
};

export default SelectorsGroup;
