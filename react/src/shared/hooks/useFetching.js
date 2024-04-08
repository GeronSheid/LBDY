import {useCallback, useState} from "react";
import {checkToken} from "shared/lib/checkToken";
import {useNavigate} from "react-router-dom";
import {AUTH_ROUTE} from "shared/consts/paths";
import {useDispatch} from "react-redux";
import {userActions} from "entities/User";

export default function useFetching(callback) {
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState({errors: false, message: ''})

    const fetching = useCallback(async (param = undefined) => {
        setIsLoading(true)
        let response
        try {
            response = await callback(param)
            
            if (response.errors) {
                setIsError({errors: true, message: response.data.message})
                const res = await checkToken(response)
                if (res) {
                    response = await callback(param)
                } 
            }
        } catch (e) {
            setIsError({errors: true, message: "Ошибка получения ответа."});
        }
        setIsLoading(false);
        return response
    }, [callback])

    return [fetching, isLoading, isError]
}
