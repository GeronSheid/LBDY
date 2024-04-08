import {useEffect, useState} from "react";
import "../../../pages/RegistrationPage/ui/RegistrationPage.scss"
import {DefaultOptions} from "entities/DefaultOptions";

const OptionsWithSearch = ({
    options,
    setOption,
    setShowOptions,
    textSearch,
    setTextSearch
}) => {
    const [searchedOptions, setSearchedOptions] = useState([])
    const [search, setSearch] = useState('')
    const searchOptions = (e) => {
        setSearch(e)
        setTextSearch(e)
        setSearchedOptions([...options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase())).sort((a, b) => a.label.slice(0,1) - b.label.slice(0,1))])
    }
    useEffect(() => {
        setSearchedOptions(options)
    }, [options]);

    return (
        <div>
            <input
                className="choices__input choices__input--cloned"
                placeholder="Поиск"
                value={search}
                onChange={(e) => {searchOptions(e.target.value)}}
            />
            <DefaultOptions
                options={searchedOptions}
                setOption={setOption}
                setShowOptions={setShowOptions}
            />
        </div>

    );
};

export default OptionsWithSearch;
