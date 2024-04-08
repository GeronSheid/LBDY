import HidePassword from "shared/assets/img/sprites/control-password_to-hide.svg";
import ShowPassword from "shared/assets/img/sprites/control-password_to-show.svg";
import { useState } from "react";
import 'shared/ui/Input/ui/Input.scss'
import { classNames } from "shared/lib/classNames";
import InputMask from "react-input-mask";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ru from "date-fns/locale/ru";

registerLocale("ru", ru);

const Input = ({
    value,
    setValue,
    placeholder = "",
    validation = false,
    className = "",
    type = "text",
    validationText = "",
    id,
    name,
    disabled,
    setFocus,
    onKeyDown,
    children,
    onBlur,
    isSmall,
    isMobile
}) => {
    const [showPassword, setShowPassword] = useState(false)
    const [highlighted, setHighlighted] = useState(false)

    // const setCursor = (e) => {
    //     const input = e.target
    //     input.focus();
    //     input.setSelectionRange(3 + e.target.value.replace(/[^0-9]/g, '').length, 3 + e.target.value.replace(/[^0-9]/g, '').length);
    // }

    return (
        <div className={classNames(
            "field",
            {
                ["field_invalid"]: validation,
            },
            []
        )}>
            {type === "password" &&
                <div style={{position: 'relative'}}>
                    <input
                        style={{
                            backgroundColor: "-internal-light-dark(#33333366) !important"
                        }}
                        className={className}
                        type={showPassword ? "text" : "password"}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => setValue(e)}
                        id={id}
                    />
                    {showPassword ?
                        <HidePassword
                            className="icon__password-control"
                            onClick={() => setShowPassword(false)}
                        />
                        :
                        <ShowPassword
                            className="icon__password-control"
                            onClick={() => setShowPassword(true)}
                        />
                    }
                </div>
            }
            {type === "text" &&
                <input
                    onKeyDown={onKeyDown}
                    className={className}
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setValue(e)}
                    id={id}
                    disabled={disabled}
                    onBlur={onBlur}
                >
                </input>
            }
            {type === "tel" &&
                <InputMask
                    className={className}
                    placeholder={highlighted ? "+7 (___) ___-__-__" : "Телефон"}
                    mask="+7 (999) 999-99-99"
                    onMouseEnter={() => setHighlighted(true)}
                    onMouseLeave={() => setHighlighted(false)}
                    value={value}
                    onChange={(e) => setValue(e)}
                    id={id}
                // onClick={(e) => setCursor(e)}
                />
            }
            {type === "textarea" &&
                <div className={className}>
                    <textarea
                        className='textarea-content'
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => setValue(e)}
                        id={id}
                    ></textarea>
                </div>
            }
            {type === 'date' &&
                <DatePicker
                    className={className}
                    dateFormat="dd.MM.yyyy"
                    placeholderText={placeholder}
                    selected={value}
                    onChange={setValue}
                    locale='ru'
                />
            }
            {type === "number" &&
                <input
                    disabled={disabled}
                    onChange={(e) => setValue(e)}
                    className={className}
                    type="number"
                    name={name}
                    onKeyDown={(evt) => ["e", "E", "+", "-",].includes(evt.key) && evt.preventDefault()}
                    placeholder={placeholder}
                    value={value}
                    onBlur={setFocus}
                />
            }
            {validation &&
                <label className="field__label">
                    {validationText}
                </label>
            }
        </div>
    );
};

export default Input;
