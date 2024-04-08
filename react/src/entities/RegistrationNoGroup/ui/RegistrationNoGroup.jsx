import { Link, useNavigate } from "react-router-dom";
import "./RegistrationNoGroup.scss"
import "pages/RegistrationPage/ui/RegistrationPage.scss"
import { AUTH_ROUTE } from "shared/consts/paths";

const RegistrationNoGroup = ({setStep}) => {
    const navigate = useNavigate()
    return (
        <div className="final-wrap">
            <div className="no-group-container">
                <div className="oops">
                    Регистрация пройдена!
                </div>
                <div className="no-group">
                    Осталось только подтвердить свой профиль. Для этого перейди в телеграм-бот @lbdybot и пройди там верификацию!
                </div>
                <div className="modalWindow__btn-wrap modalWindow__btn-wrap_auth">
                    <Link to={'https://t.me/lbdybot'} target="_blank" className="btn-text__fork">
                        Подтвердить профиль
                    </Link>
                    <button className="btn-text__service-gray" onClick={() => { navigate(AUTH_ROUTE); setStep('1'); sessionStorage.clear()}}>
                        Авторизация
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegistrationNoGroup;
