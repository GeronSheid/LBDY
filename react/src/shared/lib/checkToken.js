import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userActions } from "entities/User";
import UserApi from "shared/api/UserApi";
import LbdyNetwork from "shared/config/httpConfig";

export async function checkToken(errorMessage) {
    if (errorMessage.data.exception === 'JWTExpired' || errorMessage.data.detail === "Unauthorized") {    
        UserApi.refreshToken()
            .then(res => {
                if (res.errors || !res) {
                    UserApi.logout()
                    localStorage.clear();
                    window.location.replace(process.env.REACT_APP_AUTH_PATH)
                    return false 
                }
                LbdyNetwork.updateToken(res.data.access_token)
                return true
            })
    } else {
        return false
    }
}
