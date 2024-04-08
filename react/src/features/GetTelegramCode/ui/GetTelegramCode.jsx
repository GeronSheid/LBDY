import "features/GetTelegramCode/ui/GetTelegramCode.scss"

import { useEffect, useState, useCallback } from "react";
import { TIMER } from "shared/consts/storagesKeys";
import useWindow from "shared/hooks/useWindow";
import { useNavigate } from "react-router-dom";
import { AUTH_ROUTE, REGISTRATION_ROUTE } from "shared/consts/paths";
import { Input } from "shared/ui/Input";
import useFetching from "shared/hooks/useFetching";
import UserApi from "shared/api/UserApi";
import { REQUIRED_FIELD } from "shared/consts/consts";


const GetTelegramCode = ({ setView, setCode, setToken, code}) => {

    const [timeLeft, setTimeLeft] = useState(59)
    const [username, setUsername] = useState("")
    const [incorrectUserData, setIncorrectUserData] = useState(false)
    const [canNext, setCanNext] = useState(false)

    const { windowWidth, windowHeight, orientation } = useWindow();
    const isMobile = windowWidth < 1025 || windowHeight <= 600;
    const navigate = useNavigate()


    const [startValidation, setStartValidation] = useState(false)


    const [submitPhone, isLoading, isError] = useFetching(useCallback(async () => {
        return await UserApi.forgotPassword(username)
    }, [username]))

    useEffect(() => {
        if (sessionStorage.getItem(TIMER) !== null) {
            setTimeLeft(JSON.parse(sessionStorage.getItem(TIMER)))
        }
    }, []);

    useEffect(() => {
        if (timeLeft === 0) return
        setTimeout(() => {
            setTimeLeft(timeLeft - 1)
            JSON.stringify(sessionStorage.setItem(TIMER, timeLeft - 1))
        }, 1000)
    }, [timeLeft]);

    function handleSubmit(e) {
        e.preventDefault()
        if (username.replace(/[^0-9]/g, '').length !== 11) {
            setStartValidation(true)
        } else {
            submitPhone()
                .then(res => {
                    if (!res || res.errors) return
                    setToken(res.data)
                    setCanNext(true)
                })
        }
    }
    return (
        <>
            {isMobile ?
                <div className="getTelegramCodeMobile">
                    <h2 className="getTelegramCodeMobile__title">Восстановление пароля</h2>
                    <form className="getTelegramCodeMobile__form" id="code-to-reset-form">
                        {!canNext ?
                            <div>
                                <p className="form__descr">Мы отправим код для восстановления пароля в телеграм-бот</p>
                                <Input
                                    className="input__simple-input input__simple-input_light"
                                    placeholder="Телефон"
                                    value={username}
                                    isMobile={true}
                                    setValue={(e) => {
                                        setUsername(e.target.value.trim().replace(/[^0-9]/g, ''))
                                        setIncorrectUserData(false)
                                    }}
                                    type="tel"
                                    validation={(startValidation && username.replace(/[^0-9]/g, '').length !== 11) || incorrectUserData}
                                    validationText={isError.errors ? isError.message : (username === "" ? REQUIRED_FIELD : "Неверный номер телефона")}
                                />
                            </div>
                            :
                            <fieldset className="form__fieldset">
                                <p className="form__descr">
                                    Мы отправили код в телеграм&nbsp;
                                    <a className="form__link" href="#">@tgbot</a>
                                </p>
                                <div className="field">
                                    <input
                                        className="input__simple-input input__simple-input_light"
                                        placeholder="Код"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                    />
                                    <label className="field__label"></label>
                                </div>
                            </fieldset>
                        }
                        {canNext &&
                            <button
                                className="getTelegramCodeMobile__resubmit"
                                id="resend-code"
                                type="button"
                                disabled={timeLeft !== 0}
                                onClick={() => setCanNext(false)}
                            >
                                {timeLeft === 0 ?
                                    "Отправить повторно"
                                    :
                                    `Отправить повторно (0:${timeLeft})`
                                }
                            </button>}
                    </form>
                    {!canNext ?
                        <button
                            className="btn-shape__filled getTelegramCodeMobile__continue"
                            id="next-to-reset-pwd"
                            type="button"
                            onClick={(e) => handleSubmit(e)}
                        >
                            Отправить
                        </button>
                        :
                        <button
                            className="btn-shape__filled getTelegramCodeMobile__continue"
                            id="next-to-reset-pwd"
                            type="button"
                            disabled={code === ""}
                            onClick={() => setView(2)}
                        >
                            Далее
                        </button>}
                    <div className="getTelegramCodeMobile__hasNoAccaunt">
                        <span
                            className="getTelegramCodeMobile__toRegistration"
                            onClick={() => navigate(AUTH_ROUTE)}
                        >
                            {"На страницу авторизации"}
                        </span>
                    </div>
                </div>

                :
                //desktop
                <form className="form form_active" id="code-to-reset-form">
                    {!canNext ?
                        <>
                            <div>
                            <p className="form__descr">Мы отправим код для восстановления пароля в телеграм-бот</p>
                            <Input
                                className="input__simple-input input__simple-input_light"
                                placeholder="Телефон"
                                value={username}
                                isMobile={true}
                                setValue={(e) => {
                                    setUsername(e.target.value.trim().replace(/[^0-9]/g, ''))
                                    setIncorrectUserData(false)
                                }}
                                type="tel"
                                validation={(startValidation && username.replace(/[^0-9]/g, '').length !== 11) || incorrectUserData}
                                validationText={isError.errors ? isError.message : (username === "" ? REQUIRED_FIELD : "Неверный номер телефона")}
                            />
                            </div>
                        </>
                        :
                        <fieldset className="form__fieldset">
                            <legend className="legend">Восстановление пароля</legend>
                            <p className="form__descr">
                                Мы отправили код в телеграм&nbsp;
                                <a className="form__link" href="#">@tgbot</a>
                            </p>
                            <div className="field">
                                <input
                                    className="input__simple-input input__simple-input_light"
                                    placeholder="Код"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                                <label className="field__label"></label>
                            </div>
                        </fieldset>}
                    {canNext &&
                        <button
                            className="btn-text__fork"
                            id="resend-code"
                            type="button"
                            disabled={timeLeft !== 0}
                        >
                            {timeLeft === 0 ?
                                "Отправить повторно"
                                :
                                `Отправить повторно (0:${timeLeft})`
                            }
                        </button>
                    }
                    {!canNext ?
                        <button
                            className="btn-shape__filled"
                            id="next-to-reset-pwd"
                            type="buttpn"
                            onClick={(e) => handleSubmit(e)}
                        >
                            Отправить
                        </button>
                        :
                        <button
                            className="btn-shape__filled"
                            id="next-to-reset-pwd"
                            type="buttpn"
                            disabled={code === ""}
                            onClick={() => setView(2)}
                        >
                            Далее
                        </button>
                    }

                </form>

            }

        </>
    );
};

export default GetTelegramCode;
