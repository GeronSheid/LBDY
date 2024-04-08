import { registrationStep } from "shared/consts/storagesKeys";
import { useEffect, useState } from "react";
import { RegistrationFirstStep } from "entities/RegistrationFirstStep";
import { RegistrationSecondStep } from "entities/RegistrationSecondStep";
import { RegistrationThirdStep } from "entities/RegistrationThirdStep";
import "pages/RegistrationPage/ui/RegistrationPage.scss"
import { DynamicModuleLoader } from "shared/lib/DynamicModuleLoader";
import { registrationActions, registrationReducer } from "features/Registration/model/slice/RegistrationSlice";
import { useDispatch } from "react-redux";
import { RegistrationNoGroup } from "entities/RegistrationNoGroup";
import { AuthorizationContainer } from "widgets/AuthorizationContainer";
import useWindow from "shared/hooks/useWindow"

const Registration = () => {
    if (sessionStorage.getItem(registrationStep) === null) {
        sessionStorage.setItem(registrationStep, "1")
    }
    const [step, setStep] = useState(sessionStorage.getItem(registrationStep))
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(registrationActions.updateInitialState())
    }, []);


    const { windowWidth, windowHeight, orientation } = useWindow();
    const isMobile = windowWidth < 1025 || windowHeight <= 600;

    useEffect(() => {
        document.title ='Элбади - Регистрация'
    }, [])

    return (
        isMobile ?
            <DynamicModuleLoader
                name="register"
                reducer={registrationReducer}
            >
                {step !== "4" &&
                    <form className="form" id="registration-form">
                        {step === "1" &&
                            <RegistrationFirstStep
                                setStep={setStep}
                            />
                        }
                        {step === "2" &&
                            <RegistrationSecondStep
                                setStep={setStep}
                            />
                        }
                        {step === "3" &&
                            <RegistrationThirdStep
                                setStep={setStep}
                            />
                        }
                    </form>
                }
                {step === "4" &&
                    <RegistrationNoGroup
                        setStep={setStep}
                    />
                }
            </DynamicModuleLoader>
            :
            <DynamicModuleLoader
                name="register"
                reducer={registrationReducer}
            >
                {step !== "4" &&
                    <AuthorizationContainer>
                        <form className="form" id="registration-form">
                            {step === "1" &&
                                <RegistrationFirstStep
                                    setStep={setStep}
                                />
                            }
                            {step === "2" &&
                                <RegistrationSecondStep
                                    setStep={setStep}
                                />
                            }
                            {step === "3" &&
                                <RegistrationThirdStep
                                    setStep={setStep}
                                />
                            }
                        </form>
                    </AuthorizationContainer>
                }
                {step === "4" &&
                    <RegistrationNoGroup
                        setStep={setStep}
                    />
                }
            </DynamicModuleLoader>
    );
};

export default Registration;
