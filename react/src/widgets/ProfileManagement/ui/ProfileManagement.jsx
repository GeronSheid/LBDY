import { useState } from "react";
import './profileManagement.scss';
import { RemindersManagement } from "features/RemindersManagement";
import { PaymentTypesList } from "../../PaymentTypesList/ui/PaymentTypesList";

export const ProfileManagement = ({setDeleteReminderModalOpen, refetch, setRefetch}) => {
  
  const [switchType, setSwitchType] = useState(true);

  return (
    <div className='profileManagement'>
      <div className='profileManagement__header'>
        <div className="profileManagement__btns">
          <button 
            className={switchType ? "btn-text__tab_dark btn-text__tab_dark_active" : "btn-text__tab_dark"}
            onClick={() => setSwitchType(!switchType)}
          >
            Мои напоминания
          </button>
          <button 
            className={switchType ? "btn-text__tab_dark" : "btn-text__tab_dark btn-text__tab_dark_active"}
            onClick={() => setSwitchType(!switchType)}
          >
            Подписка
          </button>
        </div>
      </div>
      <div className="profileManagement__content-wrap">
        {switchType && <RemindersManagement setDeleteReminderModalOpen={setDeleteReminderModalOpen} refetch={refetch} setRefetch={setRefetch}/>}
        {!switchType && <PaymentTypesList />}
      </div>
    </div>
  )
}
