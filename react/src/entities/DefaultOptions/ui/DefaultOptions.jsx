import {Option} from "shared/ui/Option";
import "simplebar"
import "../../../pages/RegistrationPage/ui/RegistrationPage.scss"
import Scrollbar from "react-scrollbars-custom";

const DefaultOptions = ({
    options,
    setOption,
    setShowOptions
}) => {
    return (
        <>
            {options.length === 0 ?
                <div className="choices__list">
                    <div className="choices__item choices__item--choice has-no-results">
                        Нет подходящих элементов
                    </div>
                </div>
            :
                <Scrollbar
                    style={{height: +`${(options.length * 35 < 120) ? options.length * 45 : '120'}`}}
                    elementRef
                    trackYProps={{style:{width: "4px", background: "transparent"}}}
                    thumbYProps={{style: { background: "#687074", maxHeight: "62px", opacity: 0.5 }}}
                >
                    {options.map((option) => (
                        <Option
                            key={option.value?.id}
                            option={option}
                            setOption={setOption}
                            setShowOptions={setShowOptions}
                        />
                    ))}
                </Scrollbar>
            }
        </>
    );
};

export default DefaultOptions;
