import {Authorization} from "features/Authorization";
import {AuthorizationContainer} from "widgets/AuthorizationContainer";
import useWindow from "shared/hooks/useWindow";
import AuthorizationMobile from "pages/AuthorizationMobile/ui/AuthorizationMobile";
import { useEffect } from "react";

const AuthorizationPage = () => {

    const {windowWidth, windowHeight, orientation} = useWindow();
    const isMobile = windowWidth < 1024 || windowHeight <= 600;

    useEffect(() => {
        document.title ='Элбади - Авторизация'
    }, [])

    return (
        isMobile ?
            <AuthorizationMobile/>
            :
            <AuthorizationContainer>
                <Authorization />
            </AuthorizationContainer> 
    );
};

export default AuthorizationPage;
