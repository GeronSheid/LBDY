import React, { useEffect, useState } from 'react'
import MyTeamUser from '../../MyTeamUser/ui/MyTeamUser'
import { ModalHeader } from "shared/ui/ModalHeader/ui/ModalHeader";

export const GroupMembersModal = ({users, onClick}) => {

  const [members, setMembers] = useState([])

  useEffect(() => {
    setMembers(users)
  }, [users])

  return (
    <div className='modalWindow'>
      <ModalHeader title={'Участники'} showModal={onClick}/>
      <div className='modalWindow__content'>
        {
          members.map(member =>
            <MyTeamUser user={member} />
          )
        }
      </div>
    </div>
  )
}
