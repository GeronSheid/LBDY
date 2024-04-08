import "pages/ProfilePage/ui/ProfilePage.scss";
import { Sidebar } from "widgets/Sidebar";
import ThreeDots from "../../../shared/assets/img/threeDots.svg";
import PatchIconGray from "shared/assets/img/edit.svg";
import { useEffect, useState, useRef } from "react";
import UserApi from "shared/api/UserApi";
import useFetching from "shared/hooks/useFetching";
import { GroupListModal } from "entities/GroupListModal";
import PatchUserModal from "entities/PatchUserModal/ui/PatchUserModal";
import UniversityApi from "shared/api/UniversityApi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AUTH_ROUTE } from "shared/consts/paths";
import { ProfileManagement } from "widgets/ProfileManagement";
import DeleteModal from "entities/DeleteModal/ui/DeleteModal";
import { ModalWrapper } from "shared/ui/ModalWrapper";
import useWindow from "shared/hooks/useWindow";
import { TabBar } from "widgets/TabBar";
import ProfileMenu from "features/ProfileMenu/ui/ProfileMenu";
import { RemindersMobileModal } from "entities/RemindersMobileModal/ui/RemindersMobileModal";
import { PaimentMobileModal } from "entities/PaimentMobileModal/ui/PaimentMobileModal";
import { MobileContacts } from "entities/MobileContacts/ui/MobileContacts";

import { CSSTransition } from "react-transition-group";
import SpinnerGray from "../../../shared/assets/img/spinner-gray.svg";
import { Header } from "widgets/Header";
import { userActions } from "entities/User";

const ProfilePage = () => {
  const [me, whoAmI] = useState();
  const [myFaculty, setMyFaculty] = useState();
  const [myGrade, setMyGrade] = useState();
  const [myGroup, setMyGroup] = useState();
  const [isRuleOpen, setRuleOpen] = useState(false);
  const [opacity, setOpacity] = useState(false);
  const [isDeleteReminderModalOpen, setDeleteReminderModalOpen] =
    useState(false);
  const [isDeleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const [isPatchModal, setPatchModal] = useState(false);
  const [refetchBool, setRefetch] = useState(false);
  const [isgroupListOpen, setGroupListOpen] = useState(false);
  const [remindersModalOpen, setRemindersModalOpen] = useState(false);
  const [paimentModalOpen, setPaimentModalOpen] = useState(false);
  const [reminderId, setReminderId] = useState(null);
  const [avatar, setAvatar] = useState(null)
  const [paymentMobileHistoryOpen, setPaymentMobileHistoryOpen] =
    useState(false);
  const [contactsModalOpen, setContactsModalOpen] = useState(false);
  const [avatarLink, setAvatarLink] = useState('')

  const handleDeleteReminder = (id, bool) => {
    setReminderId(id);
    setDeleteReminderModalOpen(bool);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const remindersRef = useRef(null);
  const paymentRef = useRef(null);
  const deleteRef = useRef(null);
  const historyRef = useRef(null);
  const contactsRef = useRef(null);

  const { windowWidth, windowHeight, orientation } = useWindow();
  const isMobile = windowWidth < 1025 || windowHeight <= 600;

  function exit() {
    UserApi.logout();
    dispatch(userActions.setAuth(false));
    localStorage.clear();
    navigate(AUTH_ROUTE);
  }

  const [getMe, isMeLoading] = useFetching(async () => {
    return await UserApi.usersMe();
  });
  const [getMyFaculty, isFacultyLoading] = useFetching(async () => {
    return await UserApi.getFaculty(me.faculty_id);
  });
  const [getMyGroup, isGroupLoading] = useFetching(async () => {
    return await UniversityApi.getMyGroup(me.group_id);
  });
  const [getMyGrade, isGradeLoading] = useFetching(async () => {
    return await UniversityApi.getMyGrade(myGroup.grade_id);
  });
  const [updateAvatar] = useFetching(async (avatar) => {
    return await UserApi.updateAvatar(avatar)
  })

  useEffect(() => {
    if (typeof avatar === 'object' && avatar !== null) {
      updateAvatar(avatar)
        .then(res => {
          if (!res || res.errors) return
          setAvatarLink(res.data.avatars.medium)
        })
    }
  }, [avatar])

  useEffect(() => {
    if (avatarLink === '' && me !== undefined) {
      setAvatarLink(me.avatars.medium)
    }
  }, [me])


  const inputRef = useRef(null)

  useEffect(() => {
    document.title = "Элбади - Профиль";
  }, []);

  useEffect(() => {
    getMe().then((res) => {
      if (!res || res.errors) return;
      whoAmI(res.data);
    });
  }, [refetchBool]);

  function refetch() {
    setRefetch(!refetchBool);
  }

  //close props functions
  function closeReminders() {
    setRemindersModalOpen(false);
  }
  function closePaiment() {
    setPaimentModalOpen(false);
  }
  function closeContacts() {
    document.getElementsByClassName("main-container")[0].style.display = "flex";
    document.getElementsByClassName("tabBar")[0].style.display = "block";
    setContactsModalOpen(false);
  }

  useEffect(() => {
    if (me) {
      getMyFaculty().then((res) => {
        if (!res || res.errors) return;
        setMyFaculty(res.data);
      });
      getMyGroup().then((res) => {
        if (!res || res.errors) return;
        setMyGroup(res.data);
      });
    }
  }, [me]);

  useEffect(() => {
    if (myGroup) {
      getMyGrade().then((res) => {
        if (!res || res.errors) return;
        setMyGrade(res.data);
      });
    }
  }, [myGroup]);



  const uploadFile = (currentTarget) => {
    setAvatar(...currentTarget.files)
  }

  const isTabBarVisible = isMobile && !contactsModalOpen;
  return (
    <>
      <CSSTransition
        nodeRef={remindersRef}
        classNames="remindersMobileModal"
        in={remindersModalOpen && isMobile}
        timeout={200}
        unmountOnExit
      >
        <RemindersMobileModal
          refetchBool={refetchBool}
          setReminderId={setReminderId}
          setDeleteModalOpen={setDeleteReminderModalOpen}
          setOpasity={setOpacity}
          elementRef={remindersRef}
          close={closeReminders}
        />
      </CSSTransition>
      <CSSTransition
        nodeRef={paymentRef}
        classNames="paymentMobileModal"
        in={paimentModalOpen && isMobile}
        timeout={200}
        unmountOnExit
      >
        <PaimentMobileModal elementRef={paymentRef} close={closePaiment} />
      </CSSTransition>
      <CSSTransition
        nodeRef={deleteRef}
        classNames="deleteMobileModal"
        in={isDeleteReminderModalOpen}
        timeout={200}
        unmountOnExit
      >
        <ModalWrapper>
          <DeleteModal
            refetch={refetch}
            deleteRef={deleteRef}
            type="напоминание"
            id={reminderId}
            setDeleteModalOpen={setDeleteReminderModalOpen}
            setOpasity={setOpacity}
            isMobile={isMobile}
          />
        </ModalWrapper>
      </CSSTransition>
      <CSSTransition
        nodeRef={contactsRef}
        classNames="mobile-contacts"
        in={contactsModalOpen && isMobile}
        timeout={200}
        unmountOnExit
      >
        <MobileContacts elementRef={contactsRef} onClose={closeContacts} />
      </CSSTransition>
      {isDeleteUserModalOpen && (
        <ModalWrapper>
          <DeleteModal
            type="аккаунт"
            setDeleteModalOpen={setDeleteUserModalOpen}
            setOpasity={setOpacity}
            isMobile={isMobile}
          />
        </ModalWrapper>
      )}
      {isPatchModal && (
        <ModalWrapper>
          <PatchUserModal
            close={() => {
              setPatchModal(false), setOpacity(false);
            }}
            patchModal={isPatchModal}
            me={me}
            faculty={myFaculty}
            grade={myGrade}
            group={myGroup}
            refetch={refetch}
            isMobile={isMobile}
          />
        </ModalWrapper>
      )}
      {isgroupListOpen && (
        <ModalWrapper>
          <GroupListModal
            close={() => {
              setGroupListOpen(false), setOpacity(false);
            }}
          />
        </ModalWrapper>
      )}
      <div className='main-container'>
        {!isMobile && <Sidebar />}
        {isMobile ? (
          <div className="profilePageMobile__userCard">
            <div>
              <Header title={"Профиль"} />
              <div className="profilePageMobile__userInfo">
                <div className="profilePageMobile__userInfoWrapper">
                  <button>
                    {me ? (
                      <>
                        <img
                          className="profilePageMobile__avatar"
                          src={avatarLink}
                          alt=""
                          onClick={() => inputRef.current.click()}
                        />
                        <input
                          type="file"
                          hidden
                          ref={inputRef}
                          onChange={(e) => uploadFile(e.target)}
                        />
                      </>
                    ) : (
                      <SpinnerGray />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setPatchModal(true), setOpacity(true);
                    }}
                    className="profilePageMobile__userWrapper"
                  >
                    <span className="profilePageMobile__userName">
                      {me ? (
                        `${me.middle_name} ${me.first_name} ${me.last_name}`
                      ) : (
                        <SpinnerGray />
                      )}
                    </span>
                    <PatchIconGray className="profilePageMobile__patchButton" />
                  </button>
                </div>
                <div className="profilePageMobile__infoItemsWrapp">
                  <div className="profilePageMobile__infoItem">
                    <div className="profilePageMobile__infoType">Телефон</div>
                    <div className="profilePageMobile__infoContent">
                      {me ? `${me.phone.substring(4)}` : <SpinnerGray />}
                    </div>
                  </div>
                  <div className="profilePageMobile__infoItem">
                    <div className="profilePageMobile__infoType">Факультет</div>
                    <div className="profilePageMobile__infoContent">
                      {myFaculty ? `${myFaculty.name}` : <SpinnerGray />}
                    </div>
                  </div>
                  <div className="profilePageMobile__infoItem">
                    <div className="profilePageMobile__infoType">Курс</div>
                    <div className="profilePageMobile__infoContent">
                      {myGrade ? `${myGrade.number} Курс` : <SpinnerGray />}
                    </div>
                  </div>
                  <div className="profilePageMobile__infoItem">
                    <div className="profilePageMobile__infoType">Группа</div>
                    <div className="profilePageMobile__infoContent">
                      {myGroup ? `${myGroup.name}` : <SpinnerGray />}
                    </div>
                  </div>
                </div>
                <button
                  className="profilePageMobile__groupList"
                  onClick={() => {
                    setOpacity(true), setGroupListOpen(true);
                  }}
                >
                  Список группы
                </button>
              </div>
              <ProfileMenu
                openReminders={() => setRemindersModalOpen(true)}
                openPaiment={() => setPaimentModalOpen(true)}
                openContacts={() => {
                  document.getElementsByClassName("main-container")[0].style.display = "none";
                  document.getElementsByClassName("tabBar")[0].style.display = "none";
                  setContactsModalOpen(true);
                }}
              />
            </div>
            <div className="profilePageMobile__button-container">
              <button
                className="profilePageMobile__mobile-button"
                id="deleteUser"
                type="button"
                onClick={() => {
                  setDeleteUserModalOpen(true);
                }}
              >
                Удалить профиль
              </button>
              <button
                className="profilePageMobile__mobile-button"
                id="exitFromProfile"
                type="button"
                onClick={exit}
              >
                Выйти из профиля
              </button>
            </div>
          </div>
        ) : (
          <div className="profilePage__userCard">
            {me ? (
              <button
                className="profilePage__avatar"
                onClick={() => inputRef.current.click()}
              >
                <div className="profilePage__avatar-change">
                  <svg
                    width="56"
                    height="56"
                    viewBox="0 0 56 56"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M28 24.5C31.9286 24.5 35.1429 27.65 35.1429 31.5C35.1429 35.35 31.9286 38.5 28 38.5C24.0714 38.5 20.8571 35.35 20.8571 31.5C20.8571 27.65 24.0714 24.5 28 24.5ZM28 24.5C24.0714 24.5 20.8571 27.65 20.8571 31.5C20.8571 35.35 24.0714 38.5 28 38.5C31.9286 38.5 35.1429 35.35 35.1429 31.5C35.1429 27.65 31.9286 24.5 28 24.5ZM47.6429 14H40.5C39.9643 14 39.4286 13.825 39.0714 13.3L35.6786 9.1C34.7857 7.875 33.1786 7 31.5714 7H24.4286C22.6429 7 21.0357 7.875 20.1429 9.1L16.9286 13.3C16.5714 13.65 16.0357 14 15.5 14H8.35714C5.32143 14 3 16.275 3 19.25V43.75C3 46.725 5.32143 49 8.35714 49H47.6429C50.6786 49 53 46.725 53 43.75V19.25C53 16.275 50.6786 14 47.6429 14ZM28 42C22.1071 42 17.2857 37.275 17.2857 31.5C17.2857 25.725 22.1071 21 28 21C33.8929 21 38.7143 25.725 38.7143 31.5C38.7143 37.275 33.8929 42 28 42ZM44.9643 24.5C43.5357 24.5 42.2857 23.275 42.2857 21.875C42.2857 20.475 43.5357 19.25 44.9643 19.25C46.3929 19.25 47.6429 20.475 47.6429 21.875C47.6429 23.275 46.3929 24.5 44.9643 24.5ZM28 24.5C24.0714 24.5 20.8571 27.65 20.8571 31.5C20.8571 35.35 24.0714 38.5 28 38.5C31.9286 38.5 35.1429 35.35 35.1429 31.5C35.1429 27.65 31.9286 24.5 28 24.5ZM28 24.5C24.0714 24.5 20.8571 27.65 20.8571 31.5C20.8571 35.35 24.0714 38.5 28 38.5C31.9286 38.5 35.1429 35.35 35.1429 31.5C35.1429 27.65 31.9286 24.5 28 24.5ZM28 24.5C24.0714 24.5 20.8571 27.65 20.8571 31.5C20.8571 35.35 24.0714 38.5 28 38.5C31.9286 38.5 35.1429 35.35 35.1429 31.5C35.1429 27.65 31.9286 24.5 28 24.5ZM28 24.5C24.0714 24.5 20.8571 27.65 20.8571 31.5C20.8571 35.35 24.0714 38.5 28 38.5C31.9286 38.5 35.1429 35.35 35.1429 31.5C35.1429 27.65 31.9286 24.5 28 24.5ZM28 24.5C24.0714 24.5 20.8571 27.65 20.8571 31.5C20.8571 35.35 24.0714 38.5 28 38.5C31.9286 38.5 35.1429 35.35 35.1429 31.5C35.1429 27.65 31.9286 24.5 28 24.5ZM28 24.5C24.0714 24.5 20.8571 27.65 20.8571 31.5C20.8571 35.35 24.0714 38.5 28 38.5C31.9286 38.5 35.1429 35.35 35.1429 31.5C35.1429 27.65 31.9286 24.5 28 24.5Z"
                      fill="#979797"
                    />
                  </svg>
                </div>
                <img
                  src={me.avatars.large}
                  alt={me && me.first_name + " " + me.middle_name}
                />
                <input
                  type="file"
                  hidden
                  ref={inputRef}
                  onChange={(e) => uploadFile(e.target)}
                />
              </button>
            ) : (
              <div style={{ marginRight: 20 }}>
                <SpinnerGray />
              </div>
            )}
            <div className="profilePage__userInfo">
              <div className="profilePage__userInfoWrapper">
                <div className="profilePage__userName">
                  {me ? (
                    `${me.middle_name} ${me.first_name} ${me.last_name}`
                  ) : (
                    <SpinnerGray />
                  )}
                </div>
                <button>
                  <PatchIconGray
                    className="profilePage__patchButton"
                    onClick={() => {
                      setPatchModal(true), setOpacity(true);
                    }}
                  />
                </button>
              </div>
              <div className="profilePage__infoItemsWrapp">
                <div className="profilePage__infoItem">
                  <div className="profilePage__infoType">Телефон</div>
                  <div className="profilePage__infoContent">
                    {me ? `${me.phone.substring(4)}` : <SpinnerGray />}
                  </div>
                </div>
                <div className="profilePage__infoItem">
                  <div className="profilePage__infoType">Факультет</div>
                  <div className="profilePage__infoContent">
                    {myFaculty ? `${myFaculty.name}` : <SpinnerGray />}
                  </div>
                </div>
                <div className="profilePage__infoItem">
                  <div className="profilePage__infoType">Курс</div>
                  <div className="profilePage__infoContent">
                    {myGrade ? `${myGrade.number} Курс` : <SpinnerGray />}
                  </div>
                </div>
                <div className="profilePage__infoItem">
                  <div className="profilePage__infoType">Группа</div>
                  <div className="profilePage__infoContent">
                    {myGroup ? `${myGroup.name}` : <SpinnerGray />}
                  </div>
                </div>
              </div>
              <button
                className="profilePage__groupList btn-text__fork"
                onClick={() => {
                  setOpacity(true), setGroupListOpen(true);
                }}
              >
                Список группы
              </button>
            </div>
            <div className="profilePage__ruleButton">
              <button onClick={() => setRuleOpen(!isRuleOpen)}>
                <ThreeDots />
              </button>
              {isRuleOpen && (
                <div
                  className={
                    isRuleOpen
                      ? "profilePage__ruleBar-open"
                      : "profilePage__ruleBar"
                  }
                >
                  <button
                    className="profilePage__ruleButtonIn"
                    onClick={() => {
                      setOpacity(true), setDeleteUserModalOpen(true);
                    }}
                  >
                    Удалить профиль
                  </button>
                  <button className="profilePage__ruleButtonIn" onClick={exit}>
                    Выйти из профиля
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        {!isMobile && (
          <ProfileManagement
            setDeleteReminderModalOpen={handleDeleteReminder}
            refetch={refetchBool}
            setRefetch={setRefetch}
          />
        )}
      </div>
      {isMobile && <TabBar />}
    </>
  );
};

export default ProfilePage;
