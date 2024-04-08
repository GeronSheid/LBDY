import "pages/RegistrationPage/ui/RegistrationPage.scss"
import {useCallback, useEffect, useState} from "react";
import {RECOVERY_ROUTE} from "shared/consts/paths";
import {Input} from "shared/ui/Input";
import {useDispatch} from "react-redux";
import useFetching from "shared/hooks/useFetching";
import UserApi from "shared/api/UserApi";
import {userActions} from "entities/User";
import LbdyNetwork from "shared/config/httpConfig";
import {REFRESH_TOKEN, TOKEN} from "shared/consts/storagesKeys";
import {REQUIRED_FIELD} from "shared/consts/consts";
import Spiner from "../../../shared/assets/img/spinner.svg"
import { ModalWrapper } from "shared/ui/ModalWrapper";
import { ChangeCardModal } from "entities/ChangeCardModal";
import PaymentApi from "shared/api/PaymentApi";
import { Link, useNavigate } from "react-router-dom";

const Authorization = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [incorrectUserData, setIncorrectUserData] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [startValidation, setStartValidation] = useState(false)
    const [loginByUsername, isLoading, isError] = useFetching(useCallback(async () => {
        return await UserApi.loginByUsername(username, password)
    }, [username, password]))
    const [activateSubscription] = useFetching(async (id) => {
        return await PaymentApi.activateSubscription(id);
    })
    const [subscriptionModal, setSubscriptionModal] = useState(false)
    const [link, setLink] = useState('')
    const [refetchProfileStatus, setRefetchProfileStatus] = useState(false)
    const [verification, setVerification] = useState(false)
    const [userId, setUserId] = useState()
    const authByPhone = (e) => {
        e.preventDefault()
        if (username.replace(/[^0-9]/g, '').length !== 11 || password === "") {
            setStartValidation(true)
        } else {
            loginByUsername()
                .then(response => {
                    if (response.errors || !response) {
                        if(response.data.exception === 'InactiveSubscription') {
                            setUserId(response.data.details.user_id)
                            setSubscriptionModal(true)
                        }       
                        if (response.data.exception === "UserIsNotVerified") {
                            setVerification(true)
                        }
                        return
                    }
                    
                    dispatch(userActions.setAuth(true))
                    LbdyNetwork.updateToken(response.data.access_token)
                    localStorage.setItem(REFRESH_TOKEN, response.data.refresh_token)
                })
        }
    }

    useEffect(() => {
        if (isError.errors) setIncorrectUserData(true)
    }, [isError]);


    const handleActivation = (id) => {
        activateSubscription(id)
            .then(res => {
                if(!res || res.errors) return
                window.location.replace(res.data)
            })
    }

    return (
        <>
            {subscriptionModal && 
                <ModalWrapper>
                    <ChangeCardModal 
                        link={link} 
                        close={() => setSubscriptionModal(false)} 
                        variant={3}
                        setRefetchProfileStatus={() => setRefetchProfileStatus(!refetchProfileStatus)} 
                        activate={handleActivation}
                        userId={userId}
                    />
                </ModalWrapper>
            }
            {verification &&
                <ModalWrapper>
                    <div className="modalWindow_light">
                        <div className="modalWindow__content modalWindow__content_auth">
                            <div className="modalWindow__title">
                                Нужно подтвердить профиль
                            </div>
                            <div className="modalWindow__text modalWindow__text_center modalWindow__text_dark">
                                 Для этого перейди в телеграм-бот @lbdybot и пройди там верификацию!
                            </div>
                            <div className="modalWindow__btn-wrap modalWindow__btn-wrap_auth">
                                <Link to={'https://t.me/lbdybot'} target='_blank' className="btn-text__fork">
                                    Подтвердить профиль
                                </Link>
                                <button className="btn-text__service-gray" on onClick={() => setVerification(false)}>
                                    Авторизация
                                </button>
                            </div>
                        </div>
                    </div>
                    
                </ModalWrapper>
            }
            <form id="login-form" className="form form_active">
                <fieldset className="form__fieldset">
                    <Input
                        className="input__simple-input input__simple-input_light"
                        placeholder="Телефон"
                        value={username}
                        setValue={(e) => {
                            setUsername(e.target.value.trim().replace(/[^0-9]/g, ''))
                            setIncorrectUserData(false)
                        }}
                        type="tel"
                        validation={(startValidation && username.replace(/[^0-9]/g, '').length !== 11) || incorrectUserData}
                        validationText={isError.errors ? isError.message : (username === "" ? REQUIRED_FIELD : "Неверный номер телефона")}
                    />
                    <Input
                        value={password}
                        setValue={(e) => {
                            setPassword(e.target.value)
                            setIncorrectUserData(false)
                        }}
                        placeholder="Пароль"
                        className="input__simple-input input__simple-input_light"
                        type="password"
                        validation={(startValidation && password === "") || incorrectUserData}
                        validationText={isError.errors ? isError.message : REQUIRED_FIELD}
                    />
                </fieldset>
                <button
                    className="btn-text__fork"
                    type="button"
                    onClick={() => navigate(RECOVERY_ROUTE)}
                >
                    Не помню пароль
                </button>
                <button
                    className="btn-shape__filled"
                    type="submit"
                    onClick={(e) => authByPhone(e)}
                >
                    {isLoading ? <Spiner /> : "Вход"}
                </button>
            </form>
        </>
    );
};

export default Authorization;
