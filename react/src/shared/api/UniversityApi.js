import newBaseUrl from "shared/config/baseUrlConfig";
import LbdyNetwork from "shared/config/httpConfig";

const university = 'university';
export default class UniversityApi {
    static async getWeekSchedule(dateFrom, dateTo, groupId) {
        return await LbdyNetwork.get({url: `schedule_dynamic/?date_from=${dateFrom}&date_to=${dateTo}&group_id=${groupId}`, microService: university, newBaseUrl: newBaseUrl.UniversityApi})
    }

    static async getGrades(id, skip=0, limit=100) {
        return await LbdyNetwork.get({url: `grades/?faculty_id=${id}&skip=${skip}&limit=${limit}`, microService: university, newBaseUrl: newBaseUrl.UniversityApi})
    }
    static async getGroups(id, skip=0, limit=100) {
        return await LbdyNetwork.get({url: `groups/?faculty_id=${id}&skip=${skip}&limit=${limit}`, microService: university, newBaseUrl: newBaseUrl.UniversityApi})
    }

    static async getTeachers(id, name, skip=0, limit=10) {
        let facId
        if(id === null) {
            facId = ''
        } else {
            facId = `&faculty_id=${id}`
        }
        return await LbdyNetwork.get({url: `teachers/?name=${name}${facId}&skip=${skip}&limit=${limit}`, microService: university, newBaseUrl: newBaseUrl.UniversityApi})
    }
    static async getMyGroup(id) {
        return await LbdyNetwork.get({url: `groups/${id}/`, microService: university, newBaseUrl: newBaseUrl.UniversityApi})
    }
    static async getMyGrade(id) {
        return await LbdyNetwork.get({url: `grades/${id}/`, microService: university, newBaseUrl: newBaseUrl.UniversityApi})
    }

    static async getSubjects(id, name, skip=0, limit=10) {
        let facId
        if(id === null) {
            facId = ''
        } else {
            facId = `&faculty_id=${id}`
        }
        return await LbdyNetwork.get({url: `subjects/?text=${name}${facId}&skip=${skip}&limit=${limit}`, microService: university, newBaseUrl: newBaseUrl.UniversityApi})
    }

}
