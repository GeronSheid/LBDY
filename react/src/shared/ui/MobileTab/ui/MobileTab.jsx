import { useState } from 'react';
import './mobileTab.scss';

export const MobileTab = ({tab1, tab2, checked, setChecked}) => {
  return (
    <div className={`mobileTab ${checked ? 'mobileTab_right' : 'mobileTab_left'}`}>
      <button onClick={() => setChecked(false)} className='mobileTab__button'>
        {tab1}
      </button>
      <button onClick={() => setChecked(true)} className='mobileTab__button'>
        {tab2}
      </button>
    </div>
  )
}
