import { Link } from 'react-router-dom';
import './AcceptNewPhonePage.scss'
import { AUTH_ROUTE, MAIN_ROUTE } from 'shared/consts/paths';
import { useEffect } from 'react';
import useFetching from 'shared/hooks/useFetching';
import UserApi from 'shared/api/UserApi';
import { useLocation } from "react-router-dom"

const AcceptNewPhonePage = () => {


    const [logout] = useFetching(async () => {
        return await UserApi.logout()
    })

    const location = useLocation()
    const changeType = location.state


    useEffect(() => {
        if(changeType === "onlyGroup") return
        logout()
        localStorage.clear()
    }, [])  


    let mainInfo
    let link
    switch (changeType) {
        case "onlyPhone":
            mainInfo = <p>
                        Новый номер телефона необходимо подтвердить в 
                        <Link to="https://t.me/lbdybot"> телеграм-боте </Link>
                        и авторизоваться заново
                    </p>   
            link = <Link className to={AUTH_ROUTE} onClick={window.location.reload}>
                    Авторизоваться
                    </Link>    
            break;
        case "onlyGroup":
            mainInfo = <p>
                        Запрос на изменение твоей группы успешно отправлен, осталось дождаться ответа
                    </p>  
            link = <Link className to={MAIN_ROUTE}>
                        На главную
                    </Link>     
            break;
        case "groupAndPhone":
            mainInfo = <p>
                        Запрос на изменение твоей группы успешно отправлен, осталось дождаться ответа.
                        Новый номер телефона необходимо подтвердить в 
                        <Link to="https://t.me/lbdybot"> телеграм-боте </Link>
                        и авторизоваться заново
                    </p>   
            link = <Link className to={AUTH_ROUTE} onClick={window.location.reload}>
                    Авторизоваться
                    </Link>   
            break;
    
        default:
            break;
    }

    return (
        <div className="acceptNewPhone__main">
            <div className="acceptNewPhone__inDevelopment">
                {mainInfo}
                {link}
            </div>
        </div>
    );
};

export default AcceptNewPhonePage;
