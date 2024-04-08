import Registration from "./ui/Registration";
import {registrationActions} from "./model/slice/RegistrationSlice";
import {getFirstName} from "./model/selectors/getFirstName";
import {getMiddleName} from "./model/selectors/getMiddleName";
import {getLastName} from "./model/selectors/getLastName";
import {getPhone} from "./model/selectors/getPhone";
import {getGroupTmpName} from "./model/selectors/getGroupTmpName";
import {getGroupId} from "./model/selectors/getGroupId";
import {register} from "./model/services/register";
import {getRegisterData} from "./model/selectors/getRegisterData";
import {getRegisterLoading} from "./model/selectors/getRegisterLoading";
import {getRegisterError} from "./model/selectors/getRegisterError";
import {getGroup} from "./model/selectors/getGroup";
import {getGrade} from "./model/selectors/getGrade";
import {getFaculty} from "./model/selectors/getFaculty";
import {getSpecialization} from "./model/selectors/getSpecialization";
import {getWrongPhone} from "./model/selectors/getWrongPhone";
import {getErrorMessage} from "./model/selectors/getErrorMessage";

export {
    Registration,
    registrationActions,
    getFirstName,
    getPhone,
    getGroupTmpName,
    getGroupId,
    getMiddleName,
    getLastName,
    register,
    getRegisterData,
    getRegisterLoading,
    getRegisterError,
    getFaculty,
    getGrade,
    getGroup,
    getSpecialization,
    getWrongPhone,
    getErrorMessage
}
