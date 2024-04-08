import "pages/MainPage/ui/sass/main.scss";
import "app/styles/modules/input/input.scss";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { gsap } from "gsap";
import { RemindForm } from "shared/ui/RemindForm";
import "./PatchProjectModal.scss";
import useFetching from "shared/hooks/useFetching";
import TaskManagementApi from "shared/api/TaskManagmentApi";
import { Input } from "shared/ui/Input";
import { REQUIRED_FIELD } from "shared/consts/consts";
import { Select } from "widgets/Select";
import UserApi from "shared/api/UserApi";
import Spiner from "../../../shared/assets/img/spinner.svg";
import { useNavigate } from "react-router-dom";
import { PROJECT } from "shared/consts/paths";
import jwtDecode from "jwt-decode";
import { Switcher } from "shared/ui/Switcher/ui/Switcher";
import { ModalHeader } from "shared/ui/ModalHeader/ui/ModalHeader";
import { ModalFooter } from "shared/ui/ModalFooter/ui/ModalFooter";

const PatchProjectModal = ({
  thisProject,
  projectsModal,
  setProjectsModal,
  setHide,
  isGroup,
  setUsers,
  isMobile
}) => {
  const [remindForm, setRemindForm] = useState(false);
  const [name, setName] = useState(thisProject.name);
  const [description, setDescription] = useState(thisProject.description);
  const [options, setOptions] = useState([]);
  let setedDate = Date.parse(thisProject.date);
  setedDate = new Date(setedDate);
  const [date, setDate] = useState(setedDate);
  const formatedDate = date ? `${date?.getFullYear()}-${(date?.getMonth() + 1).toString().length === 1 ? '0' + (date?.getMonth() + 1).toString() : (date?.getMonth() + 1).toString()}-${date?.getDate() .toString().length === 1 ? '0' + date?.getDate().toString() : date?.getDate().toString()}` : null;
  const [startValidation, setStartValidation] = useState(false);
  const [newReminderTmp, setNewReminderTmp] = useState({
    days: [],
  });
  let expId;
  const [subject, setSubject] = useState([]);
  const [isPrevReminder, setIsPrevReminder] = useState();
  
  let user_ids = subject.map((user) => user.value.id);
  const navigate = useNavigate();

  const [patchProject, isLoading] = useFetching(
    useCallback(async () => {
      return await TaskManagementApi.patchProject(thisProject.project_id, {
        name,
        description,
        date: formatedDate,
        user_ids,
      });
    }, [name, description, date, user_ids])
  );

  const [getUsers] = useFetching(async () => {
    return await UserApi.getUsers();
  });

  const [fetchThisReminder, isLoadingThisReminder, isThisReminderAbsence] =
    useFetching(
      useCallback(
        async (id) => {
          return await TaskManagementApi.getThisReminder(id);
        },
        [thisProject.project_id]
      )
    );

  const [deleteReminder, isDeletingReminder] = useFetching(async () => {
    return await TaskManagementApi.deleteReminder(newReminderTmp._id);
  }, []);

  const [createReminder, isPreLoading] = useFetching(async () => {
    return await TaskManagementApi.createReminder({
      ...newReminderTmp,
      entity_id: expId,
      min: newReminderTmp.min >= 15 ? 30 : 0,
    });
  }, []);
  const [patchReminder, isPostLoading] = useFetching(
    useCallback(async () => {
      return await TaskManagementApi.patchReminder(newReminderTmp._id, {
        days: newReminderTmp.days,
        hour: newReminderTmp.hour,
        min: newReminderTmp.min >= 15 ? "30" : "00",
        text: newReminderTmp.text,
        exp_date: newReminderTmp.exp_date,
      });
    }, [newReminderTmp])
  );

  const handleSelect = (option) => {
    if (subject.includes(option)) {
      setSubject(subject.filter((selected) => selected !== option));
    } else {
      setSubject([...subject, option]);
    }
  };

  function handleCreateProject() {
    if (name === "" || description === "" || date === "") {
      setStartValidation(true);
    } else {
      patchProject().then((res) => {
        if (res.errors || !res) return;
        setUsers(res.data.users)
        setProjectsModal(false);
        setHide(false);
        navigate(PROJECT, {
          state: {
            thisProject: { ...res.data, project_id: res.data._id },
            groupProject: isGroup,
          },
        });
        if (isPrevReminder) {
          deleteReminder();
        }
      });
    }
  }

  async function handleCreateProjectAndReminder() {
    if (
      !name ||
      !description ||
      !date ||
      !newReminderTmp.days.length ||
      !newReminderTmp.min ||
      !newReminderTmp.hour ||
      !newReminderTmp.text
    ) {
      setStartValidation(true);
    } else {
      await patchProject().then((res) => {
        if (res.errors || !res) return;
        expId = res.data._id;
        navigate(PROJECT, { state: { ...res.data, project_id: res.data._id } });
      });
      if (!isPrevReminder) {
        createReminder().then((res) => {
          if (res.errors || !res) return;
          setProjectsModal(false);
          setHide(false);
        });
      } else {
        patchReminder().then((res) => {
          setProjectsModal(false);
          setHide(false);
        });
      }
    }
  }

  const createProjectFunc = () => {

    if (!remindForm) {
      handleCreateProject();
    } else {
      handleCreateProjectAndReminder();
    }
  };

  useEffect(() => {
    const fetchReminder = async () => {
      let res = await fetchThisReminder(thisProject.project_id);
      if (!res) return;
      setIsPrevReminder(!res.errors);
      if (res.errors) {
        setNewReminderTmp({
          days: [],
          text: "",
          hour: "",
          min: "",
        });
      } else {
        setNewReminderTmp(res.data);
        setRemindForm(true);
      }
    };
    fetchReminder();
  }, []);
  useEffect(() => {
    getUsers().then((res) => {
      const sub = Number(jwtDecode(localStorage.token).sub);

      if (res.errors || !res) return;
      let usersOptions = res.data.users
        .filter((user) => {
          return user.id !== sub;
        })
        .map((user) => ({
          label: `${user.first_name} ${user.middle_name}`,
          value: {
            id: user.id,
            src: user.avatars.small,
          },
        }))
        .sort(function (a, b) {
          const labelA = a.label.toUpperCase();
          const labelB = b.label.toUpperCase();

          if (labelA < labelB) {
            return -1;
          }
          if (labelA > labelB) {
            return 1;
          }

          return 0;
        });

      setOptions(usersOptions);
    });
  }, [projectsModal]);

  useEffect(() => {
    const usersOptions = thisProject.users.map((user) => ({
      label: `${user.first_name} ${user.middle_name}`,
      value: {
        id: user.id,
        src: user.avatars.small,
      },
    }));
    setSubject(
      usersOptions.filter(
        (user) =>
          user.value.id !== +jwtDecode(localStorage.getItem("token")).sub
      )
    );
  }, []);

  return (
    <div className="modalWindow">
      <ModalHeader
        showModal={() => { setHide(false); setProjectsModal(false); }}
        title='Проект'
      />
      <div className="modalWindow__content">
        <Input
          className={isMobile ? "input__simple-input_light" : "input__simple-input_dark"}
          type="text"
          name="name"
          placeholder="Название"
          value={name}
          setValue={(e) => setName(e.target.value)}
          validation={startValidation && name === ""}
          validationText={REQUIRED_FIELD}
        />
        <Input
          className={isMobile ? "input__textarea_light" : "input__textarea_dark"}
          type="textarea"
          placeholder="Описание"
          value={description}
          setValue={(e) => setDescription(e.target.value)}
          validation={startValidation && description === ""}
          validationText={REQUIRED_FIELD}
        />
        {isGroup && (
          <div className={isMobile ? "field field_light" : "field field_dark"} id="selectLesson">
            <Select
              placeholder={"Пользователи"}
              optionsType="with-search"
              options={options}
              chooseOption={subject}
              setChooseOption={(e) => handleSelect(e)}
            />
          </div>
        )}
        <Input
          className={isMobile ? "input__textarea_light" : "input__textarea_dark"}
          placeholder="Дата"
          type="date"
          value={date}
          setValue={(e) => setDate(e)}
          validation={startValidation && date === ""}
          validationText={REQUIRED_FIELD}
        />
        <ModalFooter
          submitFunction={() => createProjectFunc()}
          setRemindForm={() => setRemindForm(!remindForm)}
          remindForm={remindForm}
          reminderSwitcher={true}
          startValidation={startValidation}
          newReminderTmp={newReminderTmp}
          setNewReminderTmp={setNewReminderTmp}
          date={date}
          isDark={true}
          isMobile={isMobile}
          type={'Проект'}
        />
      </div>
    </div>
  );
};

export default PatchProjectModal;
