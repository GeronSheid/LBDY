import {memo, Suspense, useMemo} from "react";
import { routeConfig} from "shared/config/routeConfig";
import {Navigate, Route, Routes} from "react-router-dom";
import {AUTH_ROUTE, MAIN_ROUTE} from "shared/consts/paths";
import {useSelector} from "react-redux";
import {getAuthFlag} from "entities/User";
import ContentLoader from "react-content-loader";

export const AppLoader = (props) => {
    return (
        <ContentLoader
            speed={2}
            width={'100%'}
            height={'100%'}
            viewBox="0 0 400 160"
            backgroundColor="#ececec"
            foregroundColor="#cfcfcf"
            style={{ width: '100%', height: '100%' } }
            {...props}
        >
            <rect rx="2" stroke="null" id="svg_12" height="5" width="80" y="10" x="10" fill-opacity="null" stroke-opacity="null" stroke-width="NaN" fill="null"/>
            <rect rx="2" stroke="null" id="svg_14" height="5" width="80" y="20" x="10" fill-opacity="null" stroke-opacity="null" stroke-width="NaN" fill="null"/>
            <rect rx="2" stroke="null" id="svg_15" height="5" width="80" y="30" x="10" fill-opacity="null" stroke-opacity="null" stroke-width="NaN" fill="null"/>
            <rect rx="2" stroke="null" id="svg_16" height="5" width="80" y="40" x="10" fill-opacity="null" stroke-opacity="null" stroke-width="NaN" fill="null"/>
            <rect rx="2" stroke="null" id="svg_17" height="5" width="80" y="50" x="10" fill-opacity="null" stroke-opacity="null" stroke-width="NaN" fill="null"/>
            <rect stroke="null" rx="2" id="svg_18" height="45.32895" width="290" y="10" x="100" fill-opacity="null" stroke-opacity="null" stroke-width="NaN" fill="null"/>
            <rect stroke="null" rx="2" id="svg_19" height="4.605264" width="380" y="60" x="10" fill-opacity="null" stroke-opacity="null" stroke-width="NaN" fill="null"/>
        </ContentLoader>
    )
}

const AppRouter = memo(() => {
    const isAuth = useSelector(getAuthFlag)

    const routes = useMemo(() => Object.values(routeConfig).filter((route) => {
        if (route.authOnly !== isAuth) {
            return false
        }
        return true
    }), [isAuth])
    
    return (
        <Routes>
            {routes.map((route) => (
                <Route
                    key={route.path}
                    path={route.path}
                    element={(
                        <Suspense fallback={<AppLoader />}>
                            {route.element}
                        </Suspense>
                    )}
                />
            ))}
            <Route path="*" element={<Navigate to={isAuth ? MAIN_ROUTE : AUTH_ROUTE} />} />
        </Routes>
    );
});

export default AppRouter;
