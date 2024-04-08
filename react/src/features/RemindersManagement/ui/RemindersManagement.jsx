import { FilterIndicator } from "shared/ui/FilterIndicator/ui/FilterIndicator";
import "./remindersManagement.scss";
import { Scrollbar } from "react-scrollbars-custom";
import useFetching from "shared/hooks/useFetching";
import { useCallback, useEffect, useState } from "react";
import TaskManagementApi from "shared/api/TaskManagmentApi";
import { RemindersManagementItem } from "shared/ui/RemindersManagementItem";

export const RemindersManagement = ({setDeleteReminderModalOpen, refetch, setRefetch}) => {
  const [reminders, setReminders] = useState([]);
  const [getReminders, remindersLoading] = useFetching(
    useCallback(async (skip) => {
      return await TaskManagementApi.getListOfReminders(skip);
    }, [])
  );

  useEffect(() => {
    getReminders(0).then((res) => {
      if (!res || res.errors) return;
      setReminders([...res.data]);
    });
  }, [refetch]);

  return (
    <div className="remindersManagement">
      <div className="remindersManagement__header">
        <ul className="remindersManagement__filters">
          <li className="remindersManagement__filters-item">
            Текст напоминания
          </li>
          <li className="remindersManagement__filters-item">
            Тип
          </li>
          <li className="remindersManagement__filters-item">
            Дедлайн
          </li>
          <li className="remindersManagement__filters-item">Частота</li>
          <li className="remindersManagement__filters-item">Время</li>
          <li className="remindersManagement__filters-item"></li>
        </ul>
      </div>
      {reminders.length ? <Scrollbar
        disableTrackYWidthCompensation={true}
        trackYProps={{
          style: { width: "4px", background: "transparent", marginRight: -8 },
        }}
        thumbYProps={{
          style: { background: "#687074", maxHeight: "62px", opacity: 0.5 },
        }}
      >
        {reminders.map((reminder) => (
          <RemindersManagementItem
            key={reminder._id}
            remindersData={reminder}
            setDeleteReminderModalOpen={setDeleteReminderModalOpen}
          />
        ))}
      </Scrollbar> : <div className="emptyList__title">Напоминаний нет</div>}
    </div>
  );
};
