import {useState} from "react";
import "../../../pages/RegistrationPage/ui/RegistrationPage.scss"
import {registrationStep} from "shared/consts/storagesKeys";
import {useDispatch, useSelector} from "react-redux";
import {
    getFaculty,
    getGrade,
    getGroup,
    getGroupTmpName,
    getSpecialization,
    registrationActions
} from "features/Registration";
import {classNames} from "shared/lib/classNames";
import {SelectorsGroup} from "widgets/SelectorsGroup";
import {REQUIRED_FIELD} from "shared/consts/consts";
import { useNavigate } from "react-router-dom";
import { AUTH_ROUTE } from "shared/consts/paths";
import useWindow from "shared/hooks/useWindow"
import "entities/RegistrationSecondStep/ui/RegistrationSecondStep.scss"


const RegistrationSecondStep = ({setStep}) => {
    const [startValidation, setStartValidation] = useState(false)
    const faculty = useSelector(getFaculty)
    const specialization = useSelector(getSpecialization)
    const grade = useSelector(getGrade)
    const group = useSelector(getGroup)
    const groupTmpName = useSelector(getGroupTmpName)
    const [noGroup, setNoGroup] = useState(false)
    const dispatch = useDispatch()

    const { windowWidth, windowHeight, orientation } = useWindow();
    const isMobile = windowWidth < 1025 || windowHeight <= 600;
    const navigate = useNavigate()

    const setFaculty = (option) => {
        if (option !== faculty) {
            dispatch(registrationActions.setFaculty(option))
            dispatch(registrationActions.setSpecialization(""))
            dispatch(registrationActions.setGrade(""))
            dispatch(registrationActions.setGroup(""))
            dispatch(registrationActions.setGroupTmpName(""))
        }
    }

    const setSpecialization = (option) => {
        if (specialization !== option) {
            dispatch(registrationActions.setSpecialization(option))
            dispatch(registrationActions.setGrade(""))
            dispatch(registrationActions.setGroup(""))
            dispatch(registrationActions.setGroupTmpName(""))
        }
    }

    const setGrade = (option) => {
        if (option !== grade) {
            dispatch(registrationActions.setGrade(option))
            dispatch(registrationActions.setGroup(""))
            dispatch(registrationActions.setGroupTmpName(""))
        }
    }

    const setGroup = (group) => {
        // dispatch(registrationActions.setGroupId(groups.find(gr => gr.name === group).id))
        dispatch(registrationActions.setGroup(group))
        dispatch(registrationActions.setGroupTmpName(group.label))
    }

    const setGroupId = (groupId) => {
        dispatch(registrationActions.setGroupId(groupId))
    }

    const nextStep = () => {
        if (group === "" && groupTmpName === "") {
            setStartValidation(true)
        } else {
            sessionStorage.setItem(registrationStep, "3")
            setStep("3")
        }
    }

    return (
        isMobile ?

        <div className="secondStepMobile" id="registration-form-step-2">
            <div className="registration__scroll-wrap">
            <h2 className="secondStepMobile__title">Регистрация</h2>
            <fieldset className="form__fieldset">
                <div className="form__head">
                    <legend className="legend secondStepMobile__legend">Шаг 2/3</legend>
                    <div
                        className="btn-text__tab_dark secondStepMobile__back"
                        onClick={() => {
                            sessionStorage.setItem(registrationStep, "1")
                            setStep("1")
                        }}
                    >
                        Назад
                    </div>
                </div>
                <p className="form__descr">Теперь нужно понять, из какой ты группы</p>
                <SelectorsGroup
                    faculty={faculty}
                    specialization={specialization}
                    setFaculty={setFaculty}
                    setSpecialization={setSpecialization}
                    setGrade={setGrade}
                    grade={grade}
                    group={group}
                    setGroup={setGroup}
                    setGroupId={setGroupId}
                    startValidation={startValidation}
                    noGroup={noGroup}
                />
                {(noGroup && grade !== "") &&
                    <button
                        className="btn-text__fork"
                        id="swapGroupMethod"
                        type="button"
                        style={{display: "block"}}
                        onClick={() => setNoGroup(false)}
                    >
                        Выбрать группу
                    </button>
                }
            </fieldset>
            <button
                    className="secondStepMobile__contine"
                    type="button"
                    onClick={nextStep}
                >
                    Далее
            </button>
            <div className="secondStepMobile__hasAccaunt">
                    Уже есть аккаунт?
                    <span
                        className="secondStepMobile__toAuth"
                        onClick={() => { navigate(AUTH_ROUTE) }}
                    >
                        {" Войти"}
                    </span>
            </div>
            </div>
        </div>
            :
            <div className="form__wrapper form__wrapper_active" id="registration-form-step-2">
                <fieldset className="form__fieldset">
                    <div className="form__head">
                        <legend className="legend">Шаг 2/3</legend>
                        <div
                            className="btn-text__tab_dark"
                            onClick={() => {
                        sessionStorage.setItem(registrationStep, "1")
                        setStep("1")
                    }}
                >
                    Назад
                </div>
            </div>
            <p className="form__descr">Теперь нужно понять, из какой ты группы</p>
            <SelectorsGroup
                faculty={faculty}
                specialization={specialization}
                setFaculty={setFaculty}
                setSpecialization={setSpecialization}
                setGrade={setGrade}
                grade={grade}
                group={group}
                setGroup={setGroup}
                setGroupId={setGroupId}
                startValidation={startValidation}
                noGroup={noGroup}
            />
            {(noGroup && grade !== "") &&
                <button
                    className="btn-text__fork"цц
                    id="swapGroupMethod"
                    type="button"
                    style={{display: "block"}}
                    onClick={() => setNoGroup(false)}
                >
                    Выбрать группу
                </button>
            }
        </fieldset>
        <button
            className="btn-shape__filled"
            type="button"
            onClick={nextStep}
        >
            Далее
        </button>
    </div>
    );
};

export default RegistrationSecondStep;
