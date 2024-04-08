import "./remindersManagementItem.scss";
import DeleteIcon from "shared/assets/img/delete-shaped.svg";

export const RemindersManagementItem = ({ remindersData, setDeleteReminderModalOpen }) => {
  const { entity_type, exp_date, hour, min, text, days, entity_id, _id } =
    remindersData;
  const formattedMin = min >= 15 ? '30' : '00'
  const weekdayOrder = {
    Пн: 0,
    Вт: 1,
    Ср: 2,
    Чт: 3,
    Пт: 4,
    Сб: 5,
    Вс: 6,
  };
  days.sort((a, b) => weekdayOrder[a] - weekdayOrder[b]);

  return (
    <div className="remindersManagementItem">
      <div className="remindersManagementItem__col remindersManagementItem__col_text">
        {text}
      </div>
      <div className="remindersManagementItem__col">{entity_type}</div>
      <div className="remindersManagementItem__col">
        {new Date(exp_date).toLocaleDateString("ru-RU")}
      </div>
      <div className="remindersManagementItem__col">
        {`Каждый ${
          days.length === 0 || days.length === 7 ? "день" : days.join(", ")
        }`}
      </div>
      <div className="remindersManagementItem__col">{`${hour}:${formattedMin}`}</div>
      <div className="remindersManagementItem__col_btns">
        <button className="remindersManagementItem__btn" onClick={() => {setDeleteReminderModalOpen(_id, true);}}>
          <DeleteIcon width={24} height={24} className="icon__delete-item"/>
        </button>
      </div>
    </div>
  );
};