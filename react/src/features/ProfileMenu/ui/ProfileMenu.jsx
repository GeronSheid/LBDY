import "./ProfileMenu.scss";
import Arrow from "shared/assets/img/smallArrow.svg";

const ProfileMenu = ({ openReminders, openPaiment, openPaymentHistory, openContacts }) => {
  return (
    <div className="profileMenu">
      <div className="profileMenu__item" onClick={openReminders}>
        <button className="profileMenu__button">Мои напоминания</button>
        <Arrow className="profileMenu__icon" />
      </div>
      <div className="profileMenu__item" onClick={openPaiment}>
        <button className="profileMenu__button">Оплата</button>
        <Arrow />
      </div>
      <div className="profileMenu__item" onClick={openContacts}>
        <button className="profileMenu__button">Контакты</button>
        <Arrow />
      </div>
    </div>
  );
};

export default ProfileMenu;