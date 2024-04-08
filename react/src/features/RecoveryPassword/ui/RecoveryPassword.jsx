import "features/RecoveryPassword/ui/RecoveryPassword.scss"
import { Input } from "shared/ui/Input";
import { useState, useCallback, useEffect } from "react";
import { registrationStep } from "shared/consts/storagesKeys";
import useWindow from "shared/hooks/useWindow";
import { REGISTRATION_ROUTE, AUTH_ROUTE} from "shared/consts/paths";
import { useNavigate } from "react-router-dom";
import useFetching from "shared/hooks/useFetching";
import UserApi from "shared/api/UserApi";

const RecoveryPassword = ({code, token}) => {

    const [password, setPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [startValidation, setStartValidation] = useState(false)


    const { windowWidth, windowHeight, orientation } = useWindow();
    const isMobile = windowWidth < 1025 || windowHeight <= 600;
    const navigate = useNavigate()

    const [submitPassword, isLoading, isError] = useFetching(useCallback(async () => {
        return await UserApi.resetPassword(code, token, password)
    }, [code, token, password]))

    const checkValidation = (e) => {
        if (password !== newPassword
            || password === ""
            || newPassword === ""
        ) {
            setStartValidation(true)
            e.preventDefault()
        } else {
            submitPassword(code, token, password)
            setStartValidation(false)
            navigate(AUTH_ROUTE)
        }
    }

    return (
        <div>
            {isMobile ?
                <div className="recoveryPasswordMobile">
                    <h2 className="recoveryPasswordMobile__title">Восстановление пароля</h2>

                    <form className="form form_active" id="reset-pwd-form">
                        <fieldset className="form__fieldset">
                            <p className="form__descr">Придумайте новый пароль</p>
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
                                setValue={(e) => setNewPassword(e.target.value)}
                                validation={startValidation && (password !== newPassword || newPassword === "")}
                                validationText={newPassword === "" ? "Обязательное поле для заполнения" : "Пароли не совпадают"}
                            />
                        </fieldset>
                        <button
                            className="recoveryPasswordMobile__login"
                            type="submit"
                            onClick={(e) => checkValidation(e)}
                        >
                            Изменить пароль
                        </button>
                        <div className="recoveryPasswordMobile__hasNoAccaunt">
                            <span
                                className="recoveryPasswordMobile__toRegistration"
                                onClick={() => navigate(REGISTRATION_ROUTE)}
                            >
                                {"На страницу авторизации"}
                            </span>
                        </div>
                    </form>
                </div>

                :
                //desktop
                <form className="form form_active" id="reset-pwd-form">
                    <fieldset className="form__fieldset">
                        <legend className="legend">Восстановление пароля</legend>
                        <p className="form__descr">Придумайте новый пароль</p>
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
                            setValue={(e) => setNewPassword(e.target.value)}
                            validation={startValidation && (password !== newPassword || newPassword === "")}
                            validationText={newPassword === "" ? "Обязательное поле для заполнения" : "Пароли не совпадают"}
                        />
                    </fieldset>
                    <button
                        className="btn-shape__filled"
                        type="submit"
                        onClick={(e) => checkValidation(e)}
                    >
                        Изменить пароль
                    </button>
                </form>
            }

        </div>
    );
};

export default RecoveryPassword;
