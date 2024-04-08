import {classNames} from "shared/lib/classNames";
import {memo, useEffect, useRef, useState} from "react";
import {OptionsWithSearch} from "features/OptiosWithSearch";
import {DefaultOptions} from "entities/DefaultOptions";
import { Checkmark } from "shared/ui/Checkmark";
import SelectArrowLight from "shared/assets/img/select-arrow_light.svg";

const Select = memo(({
    placeholder,
    optionsType,
    options,
    chooseOption,
    setChooseOption,
    disabled = false,
    validation = false,
    validationText,
    className,
    id,
    textSearch, 
    setTextSearch
}) => {
    const [showOptions, setShowOptions] = useState(false)
    const rootRef = useRef(null);
    useEffect(() => {
        const handleClick = (e) => {
            const { target } = e;
            if (target instanceof Node && !rootRef.current?.contains(target)) {
                setShowOptions(false);
            } else {
                setShowOptions(!showOptions)
            }
        };
        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, [showOptions]);

    const backgroundStyle = {
        background: `url(${SelectArrowLight})`
    }
    return (
        <div className={classNames(
            "field",
            {
                ["field_invalid"]: validation,
            },
            [className]
            )}
            id={id}
        >
            <div
                className={classNames(
                    "choices",
                    {
                        ["is-disabled"]: disabled,
                        ["is-focused"]: showOptions && !disabled,
                        ["is-open"]: showOptions && !disabled,
                    },
                    []
                )}
                datatype="select-one"
            >   
                <div
                    style={backgroundStyle}
                    className="choices__inner"
                    ref={rootRef}
                >
                    <div className={chooseOption.length > 1 ? "choices__list choices__list--multi" : "choices__list choices__list--single"}>
                        {chooseOption === "" || chooseOption?.length < 1 || Object.values(chooseOption).length < 1  ?
                            <div className="choices__placeholder">
                                {placeholder}
                            </div>
                            :
                            <div
                                className="choices__item choices__item--selectable"
                                aria-selected="true"
                            >
                                {(!chooseOption.length) || (typeof chooseOption === 'string')
                                    ? 
                                    chooseOption.label !== (null || undefined) ? chooseOption.label : chooseOption
                                    : 
                                    chooseOption.map(option => <Checkmark key={option.value?.id} option={option} setOption={setChooseOption}/>)}
                            </div>
                        }
                        <div
                            className={classNames(
                                "choices__list choices__list--dropdown",
                                {["is-active"]: !disabled && showOptions},
                                []
                            )}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {optionsType === "with-search"
                                && <OptionsWithSearch
                                    options={options}
                                    setOption={setChooseOption}
                                    setShowOptions={setShowOptions}
                                    textSearch={textSearch}
                                    setTextSearch={setTextSearch}
                                />
                            }
                            {optionsType === "default"
                                && <DefaultOptions
                                    options={options}
                                    setOption={setChooseOption}
                                    setShowOptions={setShowOptions}
                                />
                            }
                        </div>
                    </div>
                </div>
                <SelectArrowLight className="choices__arrow" />
            </div>
            {validation &&
                <label className="field__label">
                    {validationText}
                </label>
            }
        </div>
    );
})

export default Select;
