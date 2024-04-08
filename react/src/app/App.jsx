import AppRouter from "app/providers/router/AppRouter";
import "./styles/index.scss"
import {useDispatch} from "react-redux";
import {userActions} from "entities/User";
import {useEffect} from "react";
import UserApi from "shared/api/UserApi";
import LbdyNetwork from "shared/config/httpConfig";


const App = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(userActions.initAuthData())
    }, [dispatch]);

    useEffect(() => {
        UserApi.refreshToken()
            .then(res => {
                if(!res || res.errors) {
                    UserApi.logout()
                    return
                }
                LbdyNetwork.updateToken(res.data.access_token)
                return
            })
    }, [])

    return (
        <AppRouter />
    );
};

export default App;
