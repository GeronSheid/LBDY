import "../../../../pages/RegistrationPage/ui/RegistrationPage.scss"
import {classNames} from "shared/lib/classNames";
import {useState} from "react";
import {useDispatch} from "react-redux";

const Option = ({
    option,
    setOption,
    setShowOptions
}) => {
    const [highlighted, setHighlighted] = useState(false)
    return (
        <div
            id="choices--faculty-on-item-choice-1"
            className={classNames(
                "choices__item choices__item--choice is-selected choices__item--selectable",
                {["is-highlighted"]: highlighted},
                []
            )}
            role="option"
            data-choice=""
            data-select-text="Press to select"
            data-choice-selectable=""
            aria-selected="true"
            onMouseEnter={() => setHighlighted(true)}
            onMouseLeave={() => setHighlighted(false)}
            onClick={() => {
                setOption(option)
                setShowOptions(false)
            }}
        >
            {option.label}
        </div>
    );
};

export default Option;
