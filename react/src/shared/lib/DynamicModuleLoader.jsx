import {useDispatch, useStore} from "react-redux";
import {useEffect} from "react";
import {registrationActions} from "features/Registration";

export const DynamicModuleLoader = ({
    children,
    name,
    reducer,
}) => {
    const store = useStore();
    const dispatch = useDispatch();

    useEffect(() => {
        store.reducerManager.add(name, reducer);
        dispatch({ type: `@INIT ${name} reducer`});

        return () => {
            store.reducerManager.remove(name);
            dispatch({ type: `@DESTROY ${name} reducer` });
        };
    }, []);

    return (
        <>
            {children}
        </>
    );
};
