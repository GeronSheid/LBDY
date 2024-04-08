import Mark from 'shared/assets/img/checkmark.svg'
import 'shared/ui/Checkbox/ui/checkbox.scss'
export const Checkbox = ({defChecked, handleClick, idVar, isDark, validation}) => {

  const frameChecked = `checkbox__frame checkbox__frame_checked ${isDark && 'checkbox__frame_dark'}`
  const markActive = 'checkbox__mark checkbox__mark_active'

  return (
    <div className='checkbox__wrapper'>
      <input
        className="checkbox__input_hidden"
        id={idVar && `checkbox-id-${idVar}`}
        type="checkbox"
        name="some-data"
        required
        onClick={handleClick}
        defaultChecked={defChecked}
      />
      <div
        className={defChecked ? frameChecked : `checkbox__frame ${isDark && 'checkbox__frame_dark'} ${validation && 'checkbox__frame_invalid'}`} 
        htmlFor={idVar && `checkbox-id-${idVar}`}
        onClick={handleClick}
      >
        <Mark className={defChecked ? markActive : 'checkbox__mark'} width={15} height={11} />
      </div>
    </div>
  )
}
