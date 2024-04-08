import { Header } from "widgets/Header"
import "./RegistrationPhoneAlreadyIs.scss"
import "../../../pages/RegistrationPage/ui/RegistrationPage.scss"
import { useNavigate } from "react-router-dom"
import {REGISTRATION_ROUTE, RECOVERY_ROUTE} from "shared/consts/paths";




const RegistrationPhoneAlreadyIs = () => {

    const navigate = useNavigate()

    function toFirstStep() {
        navigate(REGISTRATION_ROUTE)
    }
    function toRecovery() {
        navigate(RECOVERY_ROUTE)
    }

    return(
        <div className="form__wrapper form__wrapper_active">
            <Header/>
            <div className="login__wrapper">
                <div className="no-group-container">
                    <h2 className="oops">Указанный номер телефона уже занят</h2>
                    <div className="btn-wrap">
                        <button onClick={toFirstStep} className="btn-text__fork">Указать другой номер</button>
                        <button onClick={toRecovery} className="btn-text__fork">Я забыл свой пароль</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default RegistrationPhoneAlreadyIs