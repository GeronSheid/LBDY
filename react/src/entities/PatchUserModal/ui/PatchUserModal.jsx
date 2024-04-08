import "pages/MainPage/ui/sass/main.scss"
import "app/styles/shared.scss"
import { Input } from "shared/ui/Input";
import { REQUIRED_FIELD } from "shared/consts/consts";
import { Select } from "widgets/Select";
import Spiner from "../../../shared/assets/img/spinner.svg"
import { useEffect, useState } from "react";
import { useLayoutEffect } from "react";
import gsap from "gsap";
import { getWrongPhone } from "features/Registration";
import { useDispatch, useSelector } from "react-redux";
import { getErrorMessage } from "features/Registration";
import UserApi from "shared/api/UserApi";
import UniversityApi from "shared/api/UniversityApi";
import useFetching from "shared/hooks/useFetching";
import "entities/PatchUserModal/ui/PatchUserModal.scss"
import { Switcher } from "shared/ui/Switcher/ui/Switcher";
import { useNavigate } from "react-router-dom";
import { PAGE_NOT_FOUND } from "shared/consts/paths";
import ContactsApi from "shared/api/ContactsApi";
import { ModalHeader } from "shared/ui/ModalHeader/ui/ModalHeader";
import { ModalFooter } from "shared/ui/ModalFooter/ui/ModalFooter";

const PatchUserModal = ({ me, close, patchModal, faculty, grade, group, refetch, isMobile }) => {

    const navigate = useNavigate()

    const errorMsg = useSelector(getErrorMessage)
    const [changeGroup, setChengeGroup] = useState(false)
    const [startValidation, setStartValidation] = useState(false)
    const [lastName, setLastName] = useState(me.last_name)
    const [firstName, setFirstName] = useState(me.first_name)
    const [middleName, setMiddleName] = useState(me.middle_name)
    const [oldPhone, setOldPhone] = useState(me.phone.substring(4))
    const [phone, setPhone] = useState(me.phone.substring(4))
    const [myFaculty, setMyFaculty] = useState({ label: faculty.name, value: faculty.id })
    const [myGrade, setMyGrade] = useState({ label: `${grade.number} курс, ${grade.speciality}`, value: grade.id })
    const [myGroup, setMyGroup] = useState({ label: group.name, value: group.id })
    const [oldGroup, setOldGroup] = useState({ label: group.name, value: group.id })
    const [myReason, setMyReason] = useState("")
    const [facultyList, setFacultyList] = useState([])
    const [gradeList, setGradeList] = useState([])
    const [groupList, setGroupList] = useState([])
    const [password, setPassword] = useState("")
    const [isTransferingGroup, setTransferingGroup] = useState(true)
    const wrongPhone = useSelector(getWrongPhone)

    const reasonsList = [
        { label: "Меня отчислили", value: 1 },
        { label: "Я доучился", value: 2 }
    ]
    const [getFaculties, isFacultyLoading] = useFetching(async () => {
        return await UserApi.getFaculties()
    })
    const [patchMe, isPatchLoading] = useFetching(async () => {
        return await UserApi.patchMe({ first_name: firstName, middle_name: middleName, last_name: lastName, phone: phone.replaceAll(/[-()\s]/g, ''), is_active: true, password })
    })
    const [getGrades, isGradesLoading] = useFetching(async () => {
        return await UniversityApi.getGrades(myFaculty.value)
    })
    const [getGroups, isGroupsLoading] = useFetching(async () => {
        return await UniversityApi.getGroups(myFaculty.value)
    })
    const [getMe, isMeGetting] = useFetching(async () => {
        return await UserApi.usersMe()
    })
    const [switchGroup, isGroupChanging] = useFetching(async () => {
        return await ContactsApi.changeGroup(oldGroup.value, myGroup.value, myReason)
    })
    function handlePatchMe(e) {
        e.preventDefault();
        if (!lastName || !firstName || !middleName || !phone) {
            setStartValidation(true)
            return
        }
        if ((changeGroup === false) || oldGroup.value === myGroup.value) {
            patchMe()
                .then(res => {
                    if (!res || res.errors) return
                    if (oldPhone.replaceAll(/[-+()\s]/g, '') !== phone.replaceAll(/[-+()\s]/g, '')) {
                        navigate(PAGE_NOT_FOUND, { state: "onlyPhone" })
                    }
                    refetch()
                    close()
                    return
                })
        } else {
            if (oldPhone.replaceAll(/[-+()\s]/g, '') === phone.replaceAll(/[-+()\s]/g, '')) {
                patchMe()
                    .then(res => {
                        if (!res || res.errors) return
                        switchGroup()
                            .then(res => {
                                if (!res || res.errors) return
                                navigate(PAGE_NOT_FOUND, { state: "onlyGroup" })
                                return
                            })
                    })
            } else {
                patchMe()
                    .then(res => {
                        if (!res || res.errors) return
                        switchGroup()
                            .then(res => {
                                if (!res || res.errors) return
                                navigate(PAGE_NOT_FOUND, { state: "groupAndPhone" })
                                return
                            })
                    })
            }
        }
        


    }

    useEffect(() => {
        getMe()
            .then(res => {
                if (res.errors || !res) return
                setTransferingGroup(res.data.is_transferring_group)
            })
        getFaculties()
            .then(res => {
                if (!res || res.errors) return
                setFacultyList(res.data.map(fac => ({ label: fac.name, value: fac.id })))
            })
    }, [])

    useEffect(() => {
        if (myFaculty.value !== faculty.id) {
            setMyGrade("")
        } else {
            setMyGrade({ label: `${grade.speciality}, ${grade.number} курс`, value: grade.id })
        }
        getGrades()
            .then(res => {
                if (!res || res.errors) return
                setGradeList(res.data.map(grade => ({ label: `${grade.speciality}, ${grade.number} курс`, value: grade.id })))
            })
    }, [myFaculty])

    useEffect(() => {
        if (myGrade.value !== grade.id) {
            setMyGroup("")
        } else {
            setMyGroup({ label: group.name, value: group.id })
        }
        getGroups()
            .then(res => {
                if (!res || res.errors) return
                setGroupList(res.data.filter(group => group.grade_id === myGrade.value).map(group => ({ label: group.name, value: group.id })))
            })
    }, [myGrade, myFaculty])

    return (
        <div className="modalWindow">
            <ModalHeader
                showModal={() => close()}
                title={'Мой профиль'}
            />
            <div className="modalWindow__content">
                <Input
                    className={isMobile ? "input__simple-input_light" : "input__simple-input_dark"}
                    type="text"
                    name="name"
                    placeholder="Фамилия"
                    value={middleName}
                    setValue={(e) => setMiddleName(e.target.value)}
                    validation={startValidation && middleName === ""}
                    validationText={REQUIRED_FIELD}
                />
                <Input
                    className={isMobile ? "input__simple-input_light" : "input__simple-input_dark"}
                    type="text"
                    name="name"
                    placeholder="Имя"
                    value={firstName}
                    setValue={(e) => setFirstName(e.target.value)}
                    validation={startValidation && firstName === ""}
                    validationText={REQUIRED_FIELD}
                />
                <Input
                    className={isMobile ? "input__simple-input_light" : "input__simple-input_dark"}
                    type="text"
                    name="name"
                    placeholder="Отчество"
                    value={lastName}
                    setValue={(e) => setLastName(e.target.value)}
                    validation={startValidation && lastName === ""}
                    validationText={REQUIRED_FIELD}
                />
                <div className="modalWindow__row">
                    <Input
                        className={isMobile ? "input__simple-input_light" : "input__simple-input_dark"}
                        value={phone}
                        setValue={(e) => setPhone(e.target.value.trim())}
                        type="tel"
                        validation={(startValidation && phone.replace(/[^0-9]/g, '').length !== 11)}
                        validationText={(errorMsg !== "" && wrongPhone !== "") ? errorMsg : REQUIRED_FIELD}
                    />
                    <Input
                        className={isMobile ? "input__simple-input input__simple-input_light" : "input__simple-input_dark"}
                        type="password"
                        name="name"
                        placeholder="Новый пароль"
                        value={password}
                        setValue={(e) => setPassword(e.target.value)}
                        // validation={startValidation && password === ""}
                        validationText={REQUIRED_FIELD}
                    />

                </div>
                <div className="modalWindow__switcher-wrap">
                    <Switcher
                        idVar={"remindToggleBtnProject"}
                        handleClick={() => setChengeGroup(!changeGroup)}
                        defChecked={changeGroup}
                        isDark={!isMobile}
                        label={"Я в другой группе"}
                    />
                </div>
                {(changeGroup && !isTransferingGroup) &&
                    <div className="modalWindow__sub-content">
                        <div className="patch-user-modal__text">
                            Смена группы происходит через модератора. Ответ тебе придёт в телеграм-бот
                        </div>
                        <div className={isMobile ? "field field_light" : "field field_dark"} id="selectLesson">
                            <Select
                                    placeholder={"Факультет"}
                                    optionsType="with-search"
                                    options={facultyList}
                                    chooseOption={myFaculty}
                                    setChooseOption={(e) => setMyFaculty(e)}
                                />
                        </div>
                            <Select
                                className={isMobile ? "field field_light" : "field field_dark"}
                                placeholder={"Курс"}
                                optionsType="with-search"
                                options={gradeList}
                                chooseOption={myGrade}
                                setChooseOption={(e) => setMyGrade(e)}
                            />
                            <Select
                                className={isMobile ? "field field_light" : "field field_dark"}
                                placeholder={"Группа"}
                                optionsType="with-search"
                                options={groupList}
                                chooseOption={myGroup}
                                setChooseOption={(e) => setMyGroup(e)}
                            />
                        
                        <Input
                            className={isMobile ? "input__simple-input_light" : "input__simple-input_dark"}
                            type="text"
                            name="name"
                            placeholder="Причина"
                            value={myReason}
                            setValue={(e) => setMyReason(e.target.value)}
                            validation={startValidation && myReason === ""}
                            validationText={REQUIRED_FIELD}
                        />
                    </div>
                }
                {(changeGroup && isTransferingGroup) &&
                    <div className="patch-user-modal__text">
                        Запрос на изменение группы сейчас находится в обработке
                    </div>
                }
                <ModalFooter
                    submitFunction={(e) => handlePatchMe(e)}
                />
            </div>
        </div>
    );
};

export default PatchUserModal;
