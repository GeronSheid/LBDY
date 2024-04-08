import { useEffect, useState } from "react";
import "./GroupListModal.scss";
import { Scrollbar } from "react-scrollbars-custom";
import UserApi from "shared/api/UserApi";
import useFetching from "shared/hooks/useFetching";
import MyTeamUser from "entities/MyTeamUser/ui/MyTeamUser";
import { ModalHeader } from "shared/ui/ModalHeader/ui/ModalHeader";

const GroupListModal = ({ close }) => {
  const [members, setMembers] = useState([]);
  const [groupLink, setgroupLink] = useState([]);

  const [getMyGroup, isMyGroupLoading] = useFetching(async () => {
    return await UserApi.getUsers();
  });

  useEffect(() => {
    getMyGroup().then((res) => {
      if (!res || res.errors) return;
      setMembers(res.data.users);
      setgroupLink(res.data.group_list_url);
    });
  }, []);

  return (
    <div className="modalWindow modalWindow_light">
      <ModalHeader
        showModal={close}
        title={'Список группы'}
        icon={
          <a href={groupLink} className="groupListModal__download">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="icon__download"
            >
              <path d="M16.5103 10.8101C16.1687 10.4553 15.6027 10.449 15.2533 10.7962L12.875 13.1593V4.875C12.875 4.39175 12.4833 4 12 4C11.5168 4 11.125 4.39175 11.125 4.875V13.1593L8.74672 10.7962C8.39732 10.449 7.83129 10.4553 7.48966 10.8101C7.15556 11.1571 7.16166 11.708 7.50337 12.0475L12 16.5155L16.4966 12.0475C16.8383 11.708 16.8444 11.1571 16.5103 10.8101Z" />
              <path d="M18.1111 20C18.602 20 19 19.602 19 19.1111C19 18.6202 18.602 18.2222 18.1111 18.2222H5.88889C5.39797 18.2222 5 18.6202 5 19.1111C5 19.602 5.39797 20 5.88889 20H18.1111Z" />
            </svg>
          </a>
        }
      />
      <div className="modalWindow__content">
        {members
          .sort((a, b) => {
            const res =
              a.middle_name + a.first_name < b.middle_name + b.first_name;
            if (res) return -1;
            if (!res) return 1;
            return 0;
          })
          .map((member) => (
            <MyTeamUser user={member} />
          ))}
      </div>
    </div>
  );
};
export default GroupListModal;
