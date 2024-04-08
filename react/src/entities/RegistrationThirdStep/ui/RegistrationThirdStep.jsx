import "../../../pages/RegistrationPage/ui/RegistrationPage.scss"
import { Input } from "shared/ui/Input";
import { useCallback, useEffect, useState } from "react";
import { classNames } from "shared/lib/classNames";
import { useDispatch, useSelector } from "react-redux";
import { getPassword } from "features/Registration/model/selectors/getPassword";
import {
    registrationActions,
    register,
    getRegisterData,
    getRegisterLoading,
    getGroupTmpName, getPhone
} from "features/Registration";
import { registrationStep } from "shared/consts/storagesKeys";
import { useNavigate } from "react-router-dom";
import { AUTH_ROUTE, MAIN_ROUTE, PHONE_ALREADY_IS } from "shared/consts/paths";
import useFetching from "shared/hooks/useFetching";
import UserApi from "shared/api/UserApi";
import LbdyNetwork from "shared/config/httpConfig";
import Spiner from "../../../shared/assets/img/spinner.svg"
import { Checkbox } from "shared/ui/Checkbox";
import useWindow from "shared/hooks/useWindow"
import "entities/RegistrationThirdStep/ui/RegistrationThirdStep.scss"

const RegistrationThirdStep = ({ setStep }) => {
    const phone = useSelector(getPhone)
    const newPassword = useSelector(getPassword)
    const registerData = useSelector(getRegisterData)
    const isLoading = useSelector(getRegisterLoading)
    const groupTmpName = useSelector(getGroupTmpName)
    const [password, setPassword] = useState("")
    const [startValidation, setStartValidation] = useState(false)
    const [checkedPersDataAgreement, setCheckedPersDataAgreement] = useState(false)
    const [checkedTermsOfUse, setCheckedTermsOfUse] = useState(false)
    const [checkedPrivacy, setCheckedPrivacy] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { windowWidth, windowHeight, orientation } = useWindow();
    const isMobile = windowWidth < 1025 || windowHeight <= 600;
    const [loginFetching, isLoadingLogin] = useFetching(useCallback(async () => {
        return await UserApi.loginByUsername(phone, newPassword)
    }, [phone, newPassword]))
    const [usersMeFetching, isLoadingUsers] = useFetching(useCallback(async () => {
        return await UserApi.usersMe()
    }, []))

    const checkValidation = async (e) => {
        e.preventDefault()
        if (password !== newPassword
            || password === ""
            || newPassword === ""
            || checkedPersDataAgreement === false
            || checkedTermsOfUse === false
            || checkedPrivacy === false
        ) {
            setStartValidation(true)
        } else {
            dispatch(register(registerData))
                .then(res => {
                    
                    if (res?.error?.message === "Rejected") {
                        navigate(PHONE_ALREADY_IS)
                        return
                    }
                    if (res.payload.data.exception === "UserAlreadyExists") {
                        navigate(PHONE_ALREADY_IS)
                    }
                    if (res.payload.errors) {
                        setStep("1")
                        sessionStorage.setItem(registrationStep, "1")
                        return
                    }
                    if (groupTmpName !== "") {
                        setStep("4")
                        sessionStorage.setItem(registrationStep, "4")
                    } else {
                        loginFetching()
                            .then((res) => {
                                if (res.errors || !res) return
                                LbdyNetwork.updateToken(res.data.access_token)
                                usersMeFetching()
                                    .then(res => {
                                        if (res.errors || !res) return
                                        if (res.data.is_verified) {
                                            setStep("4")
                                            sessionStorage.setItem(registrationStep, "4")
                                        } else {
                                            navigate(MAIN_ROUTE)
                                        }
                                    })
                            })
                    }
                })
        }
    }
    return (
        isMobile ?
            <div className="thirdStepMobile" id="registration-form-step-3">
                <div className="registration__scroll-wrap">
                <h2 className="thirdStepMobile__title">Регистрация</h2>
                <fieldset className="form__fieldset">
                    <div className="form__head">
                        <legend className="legend thirdStepMobile__legend">Шаг 3/3</legend>
                        <div
                            className="btn-text__tab_dark thirdStepMobile__back"
                            onClick={() => {
                                sessionStorage.setItem(registrationStep, "2")
                                setStep("2")
                            }}
                        >
                            Назад
                        </div>
                    </div>
                    <p className="form__descr">Осталось придумать пароль</p>
                    <Input
                        className="input__simple-input input__simple-input_light input__simple-input_light-password"
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        setValue={(e) => setPassword(e.target.value)}
                        validation={startValidation && password === ""}
                        validationText="Обязательное поле для заполнения"
                    />
                    <Input
                        className="input__simple-input input__simple-input_light input__simple-input_light-password"
                        type="password"
                        placeholder="Подтверждение пароля"
                        value={newPassword}
                        setValue={(e) => dispatch(registrationActions.setPassword(e.target.value))}
                        validation={startValidation && (password !== newPassword || newPassword === "")}
                        validationText={newPassword === "" ? "Обязательное поле для заполнения" : "Пароли не совпадают"}
                        typeofSetValue="dispatch"
                    />
                    <div className={classNames(
                        "field input__checkbox",
                        { ["field_invalid"]: startValidation && checkedPersDataAgreement },
                        []
                    )}>
                        <Checkbox
                            idVar={'pp'}
                            defChecked={checkedPersDataAgreement}
                            handleClick={() => setCheckedPersDataAgreement(!checkedPersDataAgreement)}
                            isDark={true}
                            validation={startValidation && (checkedPersDataAgreement === false)}
                        />

                        <a
                            className="input__checkbox-descr"
                            href="https://s3-storage.lbdy.ru/docs/personal_data_processing.pdf"
                            target="_blank"
                        >
                            Даю согласие на обработку персональных данных
                        </a>
                    </div>
                    <div className={classNames(
                        "field input__checkbox",
                        { ["field_invalid"]: startValidation && !checkedTermsOfUse },
                        []
                    )}>
                        {/* <input
                        className="input__checkbox-input input__checkbox_mark-input"
                        id="ut"
                        type="checkbox"
                        name="useOfTerms"
                        value="accepted"
                        checked={checkedTermsOfUse}
                        onChange={() => setCheckedTermsOfUse(!checkedTermsOfUse)}
                        required
                    />
                    <label className="input__checkbox-label input__checkbox_mark-label" htmlFor="ut"></label> */}
                        <Checkbox
                            idVar={'ut'}
                            defChecked={checkedTermsOfUse}
                            handleClick={() => setCheckedTermsOfUse(!checkedTermsOfUse)}
                            isDark={true}
                            validation={startValidation && (checkedTermsOfUse === false)}
                        />
                        <a
                            className="input__checkbox-descr"
                            href="https://s3-storage.lbdy.ru/docs/terms_of_use.pdf"
                            target="_blank"
                        >
                            Ознакомлен(-а) с пользовательским соглашением
                        </a>
                    </div>
                    <div className={classNames(
                        "field input__checkbox",
                        { ["field_invalid"]: startValidation && !checkedPrivacy },
                        []
                    )}>
                        {/* <input
                        className="input__checkbox-input input__checkbox_mark-input"
                        id="pr"
                        type="checkbox"
                        name="useOfTerms"
                        value="accepted"
                        checked={checkedPrivacy}
                        onChange={() => setCheckedPrivacy(!checkedPrivacy)}
                        required
                    />
                    <label className="input__checkbox-label input__checkbox_mark-label" htmlFor="ut"></label> */}
                        <Checkbox
                            idVar={'pr'}
                            defChecked={checkedPrivacy}
                            handleClick={() => setCheckedPrivacy(!checkedPrivacy)}
                            isDark={true}
                            validation={startValidation && (checkedPrivacy === false)}
                        />
                        <a
                            className="input__checkbox-descr"
                            href="https://s3-storage.lbdy.ru/docs/privacy.pdf"
                            target="_blank"
                        >
                            Ознакомлен(-а) с политикой конфиденциальности
                        </a>
                    </div>
                </fieldset>
                <button
                    className="thirdStepMobile__contine"
                    type="submit"
                    onClick={e => checkValidation(e)}
                >
                    {(isLoading || isLoadingLogin || isLoadingUsers) ? <Spiner /> : `Зарегистрироваться`}
                </button>
                <div className="thirdStepMobile__hasAccaunt">
                    Уже есть аккаунт?
                    <span
                        className="thirdStepMobile__toAuth"
                        onClick={() => { navigate(AUTH_ROUTE) }}
                    >
                        {" Войти"}
                    </span>
                </div>
                </div>
            </div>
            :
            <div className="form__wrapper form__wrapper_active" id="registration-form-step-3">
                <fieldset className="form__fieldset">
                    <div className="form__head">
                        <legend className="legend">Шаг 3/3</legend>
                        <div
                            className="btn-text__tab_dark"
                            onClick={() => {
                                sessionStorage.setItem(registrationStep, "2")
                                setStep("2")
                            }}
                        >
                            Назад
                        </div>
                    </div>
                    <p className="form__descr">Осталось придумать пароль</p>
                    <Input
                        className="input__simple-input input__simple-input_light input__simple-input_light-password"
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        setValue={(e) => setPassword(e.target.value)}
                        validation={startValidation && password === ""}
                        validationText="Обязательное поле для заполнения"
                    />
                    <Input
                        className="input__simple-input input__simple-input_light input__simple-input_light-password"
                        type="password"
                        placeholder="Подтверждение пароля"
                        value={newPassword}
                        setValue={(e) => dispatch(registrationActions.setPassword(e.target.value))}
                        validation={startValidation && (password !== newPassword || newPassword === "")}
                        validationText={newPassword === "" ? "Обязательное поле для заполнения" : "Пароли не совпадают"}
                        typeofSetValue="dispatch"
                    />
                    <div className={classNames(
                        "field input__checkbox",
                        { ["field_invalid"]: startValidation && !checkedPersDataAgreement },
                        []
                    )}>
                        {/* <input
                    className="input__checkbox-input input__checkbox_mark-input"
                    id="pp"
                    type="checkbox"
                    name="PersDataAgreementPolicy"
                    value="accepted"
                    checked={checkedPersDataAgreement}
                    onChange={() => setCheckedPersDataAgreement(!checkedPersDataAgreement)}
                    required
                />
                <label className="input__checkbox-label input__checkbox_mark-label" htmlFor="pp"></label> */}
                        <Checkbox
                            idVar={'pp'}
                            defChecked={checkedPersDataAgreement}
                            handleClick={() => setCheckedPersDataAgreement(!checkedPersDataAgreement)}
                            isDark={true}
                            validation={startValidation && (checkedPersDataAgreement === false)}
                        />

                        <a
                            className="input__checkbox-descr"
                            href="https://s3-storage.lbdy.ru/docs/personal_data_processing.pdf"
                            target="_blank"
                        >
                            Даю согласие на обработку персональных данных
                        </a>
                    </div>
                    <div className={classNames(
                        "field input__checkbox",
                        { ["field_invalid"]: startValidation && !checkedTermsOfUse },
                        []
                    )}>
                        {/* <input
                    className="input__checkbox-input input__checkbox_mark-input"
                    id="ut"
                    type="checkbox"
                    name="useOfTerms"
                    value="accepted"
                    checked={checkedTermsOfUse}
                    onChange={() => setCheckedTermsOfUse(!checkedTermsOfUse)}
                    required
                />
                <label className="input__checkbox-label input__checkbox_mark-label" htmlFor="ut"></label> */}
                        <Checkbox
                            idVar={'ut'}
                            defChecked={checkedTermsOfUse}
                            handleClick={() => setCheckedTermsOfUse(!checkedTermsOfUse)}
                            isDark={true}
                            validation={startValidation && (checkedTermsOfUse === false)}
                        />
                        <a
                            className="input__checkbox-descr"
                            href="https://s3-storage.lbdy.ru/docs/terms_of_use.pdf"
                            target="_blank"
                        >
                            Ознакомлен(-а) с пользовательским соглашением
                        </a>
                    </div>
                    <div className={classNames(
                        "field input__checkbox",
                        { ["field_invalid"]: startValidation && !checkedPrivacy },
                        []
                    )}>
                        {/* <input
                    className="input__checkbox-input input__checkbox_mark-input"
                    id="pr"
                    type="checkbox"
                    name="useOfTerms"
                    value="accepted"
                    checked={checkedPrivacy}
                    onChange={() => setCheckedPrivacy(!checkedPrivacy)}
                    required
                />
                <label className="input__checkbox-label input__checkbox_mark-label" htmlFor="ut"></label> */}
                        <Checkbox
                            idVar={'pr'}
                            defChecked={checkedPrivacy}
                            handleClick={() => setCheckedPrivacy(!checkedPrivacy)}
                            isDark={true}
                            validation={startValidation && (checkedPrivacy === false)}
                        />
                        <a
                            className="input__checkbox-descr"
                            href="https://s3-storage.lbdy.ru/docs/privacy.pdf"
                            target="_blank"
                        >
                            Ознакомлен(-а) с политикой конфиденциальности
                        </a>
                    </div>
                </fieldset>
                <button
                    className="btn-shape__filled"
                    type="submit"
                    onClick={e => checkValidation(e)}
                    // onClick={e => setStep('4')}
                >
                    {(isLoading || isLoadingLogin || isLoadingUsers) ? <Spiner /> : `Зарегистрироваться`}
                </button>
            </div>
    );
};

export default RegistrationThirdStep;
