import {classNames} from "shared/lib/classNames";
import {AUTH_ROUTE, REGISTRATION_ROUTE} from "shared/consts/paths";
import {useLocation, useNavigate} from "react-router-dom";
import "pages/RegistrationPage/ui/RegistrationPage.scss"
import { Header } from "widgets/Header";
import { useState } from "react";

const AuthorizationContainer = ({children}) => {
    const location = useLocation()
    const navigate = useNavigate()
    const [isAuth, setIsAuth] = useState()
    return (
        <div className="wrapper">
            <Header auth={true}/>
            <div className="main-container main-container_auth login">
                
                <div className="login__wrapper">
                    <button
                        className={classNames(
                            "btn-text__tab_dark",
                            {["btn-text__tab_dark_active"]: location.pathname === AUTH_ROUTE},
                            []
                        )}
                        onClick={() => {navigate(AUTH_ROUTE); setIsAuth(false)}}
                    >
                        Вход
                    </button>
                    <button
                        className={classNames(
                            "btn-text__tab_dark",
                            {["btn-text__tab_dark_active"]: location.pathname === REGISTRATION_ROUTE},
                            []
                        )}
                        onClick={() => {navigate(REGISTRATION_ROUTE); setIsAuth(true)}}
                    >
                        Регистрация
                    </button>
                </div>
                <div className={`container ${isAuth ? 'container_reg' : 'container_auth'}`}>
                    {children}
                </div>
            </div>     
        </div>

    );
};

export default AuthorizationContainer;
