import "pages/RegistrationPage/ui/RegistrationPage.scss"
import {useState, useEffect} from "react";
import {GetTelegramCode} from "features/GetTelegramCode";
import {RecoveryPassword} from "features/RecoveryPassword";
import {AuthorizationContainer} from "widgets/AuthorizationContainer";
import useWindow from "shared/hooks/useWindow";


const PasswordRecoveryPage = () => {
    const [view, setView] = useState(1)
    const [code, setCode] = useState("")
    const [token, setToken] = useState("")

    
    const {windowWidth, windowHeight, orientation} = useWindow();
    const isMobile = windowWidth < 1025 || windowHeight <= 600;

    useEffect(() => {
        document.title = 'Элбади - восстановление пароля'
    }, [])

    return (
        isMobile ?
        view === 1 ? <GetTelegramCode code={code} setView={setView} setCode={setCode} setToken={setToken}/>
                    : 
                    <RecoveryPassword code={code} token={token}/>
        :
        <AuthorizationContainer>
            {view === 1 && <GetTelegramCode code={code} setView={setView} setCode={setCode} setToken={setToken}/>}
            {view === 2 && <RecoveryPassword code={code} token={token}/>}
        </AuthorizationContainer>
    );
};

export default PasswordRecoveryPage;
