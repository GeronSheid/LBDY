import React from 'react'
import 'shared/ui/IconButton/ui/IconButton.scss'

export const IconButton = ({icon, onClick }) => {
  return (
    <button className='btn-shape__archive-item' onClick={onClick}>{icon}</button>
  )
}
