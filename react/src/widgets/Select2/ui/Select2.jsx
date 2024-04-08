import React, { useEffect, useRef } from 'react'

export const Select2 = ({
  className,
  type = 'default',
  chooseOption,
  setChooseOption,
  placeholder
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {

    const handleClick = (e) => {
      const {target} = e;
      if (target instanceof Node && !selectRef.current?.contains(target)) {
        setShowOptions(false);
      } else {
        setShowOptions(!showOptions);
      }
    }

    window.addEventListener('click', handleClick);

    return () => window.removeEventListener('click', handleClick);

  }, [showOptions])

  return (
    <div className='field'>
      <div className='selectInput'>
        <div 
          className='selectInput__inner'
          ref={selectRef}
        >
            {type = 'default' &&
              <>
                {
                  (chooseOption === '' || chooseOption.lenght === 0 || Object.values(chooseOption).length === 0)
                    ?
                    <div className="selectInput__placeholder">
                      {placeholder}
                    </div>
                    :
                    <div className='selectInput__chooseItem'>
                      {chooseOption.label ? chooseOption.label : chooseOption}
                    </div>
                }
              </>
            }
        </div>
        <div>
          
        </div>
      </div>
    </div >
  )
}
