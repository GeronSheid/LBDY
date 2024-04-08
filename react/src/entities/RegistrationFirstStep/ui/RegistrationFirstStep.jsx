import "../../../pages/RegistrationPage/ui/RegistrationPage.scss"
import { useEffect, useState } from "react";
import { Input } from "shared/ui/Input";
import { registerData, registrationStep } from "shared/consts/storagesKeys";
import { useDispatch, useSelector } from "react-redux";
import {
    getFirstName,
    getMiddleName,
    getPhone,
    getLastName,
    registrationActions, getErrorMessage, getWrongPhone
} from "features/Registration";
import { useNavigate } from "react-router-dom";
import { AUTH_ROUTE } from "shared/consts/paths";
import { REQUIRED_FIELD } from "shared/consts/consts";
import useWindow from "shared/hooks/useWindow"
import "entities/RegistrationFirstStep/ui/RegistrationFirstStep.scss"

const RegistrationFirstStep = ({
    setStep
}) => {
    const name = useSelector(getFirstName)
    const surname = useSelector(getLastName)
    const patronymic = useSelector(getMiddleName)
    const phone = useSelector(getPhone)
    const errorMsg = useSelector(getErrorMessage)
    const wrongPhone = useSelector(getWrongPhone)
    const [startValidation, setStartValidation] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { windowWidth, windowHeight, orientation } = useWindow();
    const isMobile = windowWidth < 1025 || windowHeight <= 600;

    const checkValidation = () => {
        if (surname === ""
            || name === ""
            || patronymic === ""
            || phone.replace(/[^0-9]/g, '').length !== 11
        ) {
            setStartValidation(true)
        } else if (errorMsg !== "") {
            if (phone !== wrongPhone) {
                sessionStorage.setItem(registrationStep, "3")
                setStep("3")
            }
        } else {
            sessionStorage.setItem(registrationStep, "2")
            setStep("2")
        }
    }

    useEffect(() => {
        if (phone !== wrongPhone && wrongPhone !== "") {
            dispatch(registrationActions.setWrongPhone(""))
        }
    }, [phone]);

    return (
        isMobile ?
            <div className="firstStepMobile" id="registration-form-step-1">
                <div className="registration__scroll-wrap">
                    <h2 className="firstStepMobile__title">Регистрация</h2>
                    <fieldset className="form__fieldset">
                        <div className="form__head">
                            <legend className="legend firstStepMobile__legend">Шаг 1/3</legend>

                        </div>
                        <p className="form__descr">Заполни реальные данные, иначе одногруппники не поймут, кто ты</p>
                        <Input
                            className="input__simple-input input__simple-input_light"
                            type="text"
                            value={patronymic}
                            placeholder="Фамилия"
                            setValue={(e) => dispatch(registrationActions.setMiddleName(e.target.value))}
                            validation={startValidation && patronymic === ""}
                            validationText={REQUIRED_FIELD}
                        />
                        <Input
                            className="input__simple-input input__simple-input_light"
                            type="text"
                            placeholder="Имя"
                            value={name}
                            setValue={(e) => dispatch(registrationActions.setFirstName(e.target.value))}
                            validation={startValidation && name === ""}
                            validationText={REQUIRED_FIELD}
                        />
                        <Input
                            className="input__simple-input input__simple-input_light"
                            type="text"
                            placeholder="Отчество"
                            value={surname}
                            setValue={(e) => dispatch(registrationActions.setLastName(e.target.value))}
                            validation={startValidation && surname === ""}
                            validationText={REQUIRED_FIELD}
                        />
                        <Input
                            className="input__simple-input input__simple-input_light"
                            value={phone}
                            setValue={(e) => dispatch(registrationActions.setPhone(e.target.value.trim()))}
                            type="tel"
                            validation={(startValidation && phone.replace(/[^0-9]/g, '').length !== 11) || wrongPhone !== ""}
                            validationText={(errorMsg !== "" && wrongPhone !== "") ? errorMsg : REQUIRED_FIELD}
                        />
                    </fieldset>
                    <button
                        className="firstStepMobile__contine"
                        type="button"
                        onClick={checkValidation}
                    >
                        Далее
                    </button>
                    <div className="firstStepMobile__hasAccaunt">
                            Уже есть аккаунт?
                            <span
                                className="firstStepMobile__toAuth"
                                onClick={() => { navigate(AUTH_ROUTE) }}
                            >
                                {" Войти"}
                            </span>
                    </div>
                </div>
            </div>
            :
            <div className="form__wrapper form__wrapper_active" id="registration-form-step-1">
                <fieldset className="form__fieldset">
                    <div className="form__head">
                        <legend className="legend">Шаг 1/3</legend>
                        <div
                            className="btn-text__tab_dark"
                            onClick={() => { navigate(AUTH_ROUTE) }}
                        >
                            Назад
                        </div>
                    </div>
                    <p className="form__descr">Заполни реальные данные, иначе одногруппники не поймут, кто ты</p>
                    <Input
                        className="input__simple-input input__simple-input_light"
                        type="text"
                        value={patronymic}
                        placeholder="Фамилия"
                        setValue={(e) => dispatch(registrationActions.setMiddleName(e.target.value))}
                        validation={startValidation && patronymic === ""}
                        validationText={REQUIRED_FIELD}
                    />
                    <Input
                        className="input__simple-input input__simple-input_light"
                        type="text"
                        placeholder="Имя"
                        value={name}
                        setValue={(e) => dispatch(registrationActions.setFirstName(e.target.value))}
                        validation={startValidation && name === ""}
                        validationText={REQUIRED_FIELD}
                    />
                    <Input
                        className="input__simple-input input__simple-input_light"
                        type="text"
                        placeholder="Отчество"
                        value={surname}
                        setValue={(e) => dispatch(registrationActions.setLastName(e.target.value))}
                        validation={startValidation && surname === ""}
                        validationText={REQUIRED_FIELD}
                    />
                    <Input
                        className="input__simple-input input__simple-input_light"
                        value={phone}
                        setValue={(e) => dispatch(registrationActions.setPhone(e.target.value.trim()))}
                        type="tel"
                        validation={(startValidation && phone.replace(/[^0-9]/g, '').length !== 11) || wrongPhone !== ""}
                        validationText={(errorMsg !== "" && wrongPhone !== "") ? errorMsg : REQUIRED_FIELD}
                    />
                </fieldset>
                <button
                    className="btn-shape__filled"
                    type="button"
                    onClick={checkValidation}
                >
                    Далее
                </button>
            </div>
    );
};

export default RegistrationFirstStep;
