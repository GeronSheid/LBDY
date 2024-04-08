import newBaseUrl from "shared/config/baseUrlConfig";
import LbdyNetwork from "shared/config/httpConfig";

const taskManagement = 'task-management';

export default class TaskManagementApi {
    static async getDeadlines (st) {
        return await LbdyNetwork.get({url: `deadlines/?st=${st}`, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }

    static async createDeadline (name, date, status) {
        return await LbdyNetwork.post({url: `deadlines/`, body: { 
                deadline: {
                    name: name,
                    date: date,
                    status: status
                }
        }, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }

    static async deleteDeadline (id) {
        return await LbdyNetwork.delete({url: `deadlines/${id}/`, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }

    static async getProjects (status) {
        return await LbdyNetwork.get({url: `projects/management/?_status=${status}`, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }

    static async getGroupProjects (status) {
        return await LbdyNetwork.get({url: `projects/management/?group_project=true&_status=${status}`, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }
    static async getMyProjects (status) {
        return await LbdyNetwork.get({url: `projects/management/?group_project=false&_status=${status}`, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }

    static async createProject (name, description, date, users=[]) {
        return await LbdyNetwork.post({url: `projects/`, body: 
            {
                name: name,
                description: description,
                date: date,
                user_ids: users
            },
        microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }

    static async updateProject (projectId, status="archived") {
        return await LbdyNetwork.put({url: `projects/management/${projectId}/`, body: {status: status}, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }
    static async patchProject (projectId, body) {
        return await LbdyNetwork.put({url: `projects/${projectId}/`, body, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }

    static async updateDeadline (deadlineId, name, date, status="archived") {
        return await LbdyNetwork.put({url: `deadlines/${deadlineId}/`, body: 
            {
                name: name,
                date: date,
                status: status
            }, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi}
        )
    }

    static async getLessonsList (date) {
        return await LbdyNetwork.get({url: `home_tasks/get_list_by_date/?_date=${date}`, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }

    static async getHomeTasks (status) {
        return await LbdyNetwork.get({url: `home_tasks/management/?_status=${status}`, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }

    static async createHomework (name, id, description) {
        return await LbdyNetwork.post({url: `home_tasks/`, body: {
            home_task: {
                name: name,
                lesson_id: id,
                description: description
            }
        }, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }

    static async updateHomeworkStatus (id, homeworkStatus='archived') {
        return await LbdyNetwork.put({url: `home_tasks/management/${id}/`, body: {
            status: homeworkStatus
        }, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }

    static async patchHomework (id, name, description) {
        return await LbdyNetwork.put({url: `home_tasks/${id}/`, body: {
            name: name,
            description: description
        }, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }

    static async sendFiles (id, files, imgs) {
        const body = new FormData()
        if (files.length !== 0) {
            for (let i = 0; i <= files.length - 1; i++) {
                body.append('files', files[i])
            }
        }
        if (imgs.length !== 0) {
            for (let i = 0; i <= imgs.length - 1; i++) {
                body.append('files', imgs[i])
            }
        }
        return await LbdyNetwork.postFiles({url: `home_tasks/${id}/upload/`, body: body, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }

    static async deleteFile(id, url) {
        return await LbdyNetwork.delete({url: `home_tasks/${id}/delete_file/?url=${url}`, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }

    static async deleteHomework (id) {
        return await LbdyNetwork.delete({url: `home_tasks/management/${id}/`, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }
    static async getHomeworkData (lesson_id) {
        return await LbdyNetwork.get({url: `home_tasks/get_by_lesson_id/?lesson_id=${lesson_id}`, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }

    static async createReminder (body) {
        return await LbdyNetwork.post({url: `reminders/`, body, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }
    static async patchReminder (id, body) {
        return await LbdyNetwork.put({url: `reminders/${id}/`, body, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }
    static async deleteReminder (id,) {
        return await LbdyNetwork.delete({url: `reminders/${id}/`, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }
    static async getThisReminder (id) {
        return await LbdyNetwork.get({url: `reminders/${id}/`, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }
    static async getListOfReminders (skip, limit = 25) {
        return await LbdyNetwork.get({url: `reminders/?skip=${skip}&limit=${limit}`, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }

    static async createProjectTask (name, description, project_id, date) {
        return await LbdyNetwork.post({url: `projects/tasks/`, body: {
            project_task: {
                name: name,
                description: description,
                project_id: project_id,
                date: date
            }
        }, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }

    static async getProjectTasks (id) {
        return await LbdyNetwork.get({url: `projects/tasks/?project_id=${id}`, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }
    static async deleteProject (id) {
        return await LbdyNetwork.delete({url: `projects/management/${id}/`, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }
    static async deleteProjectTasks (id) {
        return await LbdyNetwork.delete({url: `projects/tasks/${id}/`, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }
    static async updateProjectTask (id, body) {
        return await LbdyNetwork.put({url: `projects/tasks/${id}/`, body, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }
    static async getCommentsList (id) {
        return await LbdyNetwork.get({url: `projects/tasks/comments/?project_task_id=${id}`, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }
    static async createComment (body) {
        return await LbdyNetwork.post({url: `projects/tasks/comments/`, body, microService: taskManagement, newBaseUrl: newBaseUrl.TaskManagementApi})
    }
}

