import React, { useState } from 'react'
import 'shared/ui/Switcher/ui/switcher.scss'

export const Switcher = ({defChecked, handleClick, idVar, isDark, label='Напоминать мне об этом'}) => {
  const frameChecked = `switcher__frame switcher__frame_checked ${isDark && 'switcher__frame_dark'}`;

  return (
    <div className='switcher__wrapper'>
      <input
        className="switcher__input_hidden"
        id={idVar && `switcher-id-${idVar}`}
        type="checkbox"
        name="some-data"
        required
        onClick={handleClick}
        defaultChecked={defChecked}
      />
      <label 
        className={defChecked ? frameChecked : `switcher__frame ${isDark && 'switcher__frame_dark'}`}
        htmlFor={idVar && `switcher-id-${idVar}`}
      >
      </label>
      <label htmlFor={idVar && `switcher-id-${idVar}`} className={isDark ? 'switcher__label' : 'switcher__label_light'}>
        {label}
      </label>
    </div>
  )
}
