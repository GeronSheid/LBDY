import "pages/MainPage/ui/sass/main.scss";
import "app/styles/modules/input/input.scss";
import { useCallback, useEffect, useLayoutEffect, useState, nodeRef } from "react";
import { gsap } from "gsap";
import "./CreateProjectModal.scss";
import useFetching from "shared/hooks/useFetching";
import TaskManagementApi from "shared/api/TaskManagmentApi";
import { Input } from "shared/ui/Input";
import { REQUIRED_FIELD } from "shared/consts/consts";
import { Select } from "widgets/Select";
import UserApi from "shared/api/UserApi";
import { useNavigate } from "react-router-dom";
import { PROJECT } from "shared/consts/paths";
import jwtDecode from "jwt-decode";
import { ModalHeader } from "shared/ui/ModalHeader/ui/ModalHeader";
import { ModalFooter } from "shared/ui/ModalFooter/ui/ModalFooter";

const CreateProjectModal = ({
  groupProjects,
  projectsModal,
  setProjectsModal,
  setHide,
  setRefetchBool,
  isMobile
}) => {
  const [remindForm, setRemindForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState([]);
  const [date, setDate] = useState("");
  const [startValidation, setStartValidation] = useState(false);
  const [newReminderTmp, setNewReminderTmp] = useState({
    days: [],
  });
  const formatedDate = date ? `${date?.getFullYear()}-${(date?.getMonth() + 1).toString().length === 1 ? '0' + (date?.getMonth() + 1).toString() : (date?.getMonth() + 1).toString()}-${date?.getDate() .toString().length === 1 ? '0' + date?.getDate().toString() : date?.getDate().toString()}` : null;
  let expId;
  const navigate = useNavigate();
  const [createProject, isLoading] = useFetching(
    useCallback(async () => {
      return await TaskManagementApi.createProject(
        name,
        description,
        formatedDate,
        groupProjects ? [...subject.map((sub) => sub.value.id)] : []
      );
    }, [name, description, date])
  );
  const [getUsers, isPreloading] = useFetching(async () => {
    return await UserApi.getUsers();
  });
  const [createReminder, isPreLoading] = useFetching(async () => {
    return await TaskManagementApi.createReminder({
      ...newReminderTmp,
      entity_id: expId,
      min: newReminderTmp.min >= 15 ? 30 : 0,
    });
  }, []);

  const [subject, setSubject] = useState([]);
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
      createProject().then((res) => {
        if (res.errors || !res) return;
        setProjectsModal(false);
        setRefetchBool();
        navigate(PROJECT, {
          state: {
            thisProject: { ...res.data, project_id: res.data._id },
            groupProject: groupProjects,
          },
        });
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
      await createProject().then((res) => {
        if (res.errors || !res) return;
        expId = res.data._id;
        navigate(PROJECT, {
          state: {
            thisProject: { ...res.data, project_id: res.data._id },
            groupProject: groupProjects,
          },
        });
      });
      createReminder().then((res) => {
        if (res.errors || !res) return;
        setProjectsModal(false);
        setRefetchBool();
      });
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
  useLayoutEffect(() => {
    if (projectsModal) {
      gsap.to(".modal-projects", { opacity: 1, zIndex: 10000, duration: 0.15 });
      setTimeout(() => setHide(false), 200);
    } else {
      gsap.to(".modal-projects", { opacity: 0, zIndex: -10, duration: 0.15 });
      setTimeout(() => setHide(true), 200);
    }
  }, [projectsModal]);

  return (
    <div 
      className="modalWindow"
      ref={nodeRef}
    >
      <ModalHeader
        showModal={() => {
          setHide(true);
          setProjectsModal(false);
        }}
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
        {groupProjects && (
          <div className={isMobile ? "field field_light" : "field field_dark"} id="selectLesson">
            <Select
              placeholder={"Одногруппники"}
              optionsType="with-search"
              options={options}
              chooseOption={subject}
              setChooseOption={(e) => handleSelect(e)}
            />
          </div>
        )}
        <Input
          className={isMobile ? "input__simple-input_light" : "input__simple-input_dark"}
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
      {/* <div className="projects__header-left">
        <button
          className="btn-text__close-modal_light"
          onClick={() => {
            setHide(true), setProjectsModal(false);
          }}
        >
          Закрыть
        </button>
        <legend className="legend">Проект</legend>
      </div>
      <div className="form-wrapper">
        <form className="form">
          <fieldset className="form__fieldset">
            <Input
              className="input__simple-input_dark"
              type="text"
              name="name"
              placeholder="Название"
              value={name}
              setValue={(e) => setName(e.target.value)}
              validation={startValidation && name === ""}
              validationText={REQUIRED_FIELD}
            />
            <Input
              className="input__textarea_dark"
              type="textarea"
              placeholder="Описание"
              value={description}
              setValue={(e) => setDescription(e.target.value)}
              validation={startValidation && description === ""}
              validationText={REQUIRED_FIELD}
            />
            {groupProjects && (
              <div className="field field_dark" id="selectLesson">
                <Select
                  placeholder={"Одногруппники"}
                  optionsType="with-search"
                  options={options}
                  chooseOption={subject}
                  setChooseOption={(e) => handleSelect(e)}
                />
              </div>
            )}
            <Input
              className="input__simple-input_dark"
              placeholder="Дата"
              type="date"
              value={date}
              setValue={(e) => setDate(e)}
              validation={startValidation && date === ""}
              validationText={REQUIRED_FIELD}
            />
            <div className="field input__checkbox">
              <Switcher
                idVar={"remindToggleBtnProject"}
                handleClick={() => setRemindForm(!remindForm)}
                defChecked={remindForm}
                isDark={true}
              />
            </div>
            {remindForm && (
              <RemindForm
                validation={startValidation}
                newReminderTmp={newReminderTmp}
                setNewReminderTmp={setNewReminderTmp}
                date={date}
                type="Проект"
              />
            )}
            <button
              style={{ marginTop: remindForm ? 16 : 24, zIndex: 1 }}
              className="btn-shape__filled"
              id="addNewProject"
              type="submit"
              onClick={(e) => createProjectFunc(e)}
            >
              {isLoading || isPreloading ? (
                <Spiner className="loader" />
              ) : (
                "Cоздать"
              )}
            </button>
          </fieldset>
        </form>
      </div> */}
    </div>
  );
};

export default CreateProjectModal;
