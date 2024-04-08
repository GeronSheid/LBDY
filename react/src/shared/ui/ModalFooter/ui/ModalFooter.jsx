import { useState } from "react";
import { RemindForm } from "shared/ui/RemindForm";
import { Switcher } from "shared/ui/Switcher/ui/Switcher";

export const ModalFooter = ({
  submitFunction,
  remindForm,
  setRemindForm,
  isPublic,
  setIsPublic,
  myFaculty,
  setFaculty,
  startValidation,
  newReminderTmp,
  setNewReminderTmp,
  date,
  type,
  reminderSwitcher,
  publicSwitcher,
  knbSwitcher,
  isDark = true,
  isMobile = false,
  uploadFunction,
  inputRef, 
  file = [],
  btnText = 'Сохранить'
}) => {
  return (
    <div className="modalWindow__footer">
      <div className="modalWindow__footer-controls">
      {knbSwitcher && (
          <div className="modalWindow__switcher-wrap">
            <Switcher
              idVar={"remindToggleBtnHome"}
              handleClick={() => setFaculty(!myFaculty)}
              defChecked={myFaculty}
              isDark={(isDark && !isMobile)}
              label={'Преподаватели со всех факультетов'}
            />
          </div>
        )}
        {publicSwitcher && (
          <div className="modalWindow__switcher-wrap">
            <Switcher
              idVar={"remindToggleBtnHomeTask"}
              handleClick={() => setIsPublic(!isPublic)}
              defChecked={isPublic}
              label={"Сделать публичным"}
              isDark={(isDark && !isMobile)}
            />
          </div>
        )}
        {reminderSwitcher && (
          <div className="modalWindow__switcher-wrap">
            <Switcher
              idVar={"remindToggleBtnHomeTask"}
              handleClick={() => setRemindForm(!remindForm)}
              defChecked={remindForm}
              isDark={!isMobile}
            />
          </div>
        )}
        {remindForm && (
          <RemindForm
            isMobile={isMobile}
            validation={startValidation}
            newReminderTmp={newReminderTmp}
            setNewReminderTmp={setNewReminderTmp}
            date={date}
            type={type}
          />
        )}
        <div className="modalWindow__submit-wrap">
          {isMobile && (type === 'Домашнее задание' || type === 'файл') && file.length === 0 &&
            <button 
              className="btn-shape__empty btn-shape__empty_dark"
              onClick={() => inputRef.current.click()}
              >
              Добавить файл
            </button>
          }
          <button
            className="btn-shape__filled"
            onClick={(e) => {
              submitFunction(e);
            }}
          >
            {btnText}
          </button>
        </div>
      </div>
    </div>
  );
};
