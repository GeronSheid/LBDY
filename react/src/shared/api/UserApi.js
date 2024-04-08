import newBaseUrl from "shared/config/baseUrlConfig";
import LbdyNetwork from "shared/config/httpConfig";
import {REFRESH_TOKEN} from "shared/consts/storagesKeys";

const university = 'university';
const users = 'users';

export default class UserApi {
    static async loginByUsername (username, password) {
        return await LbdyNetwork.postUrlencoded(
            {url: 'auth/jwt/login/',
            body: {
                'username': username,
                'password': password
            }, microService: users, newBaseUrl: newBaseUrl.UserApi})
    }

    static async register (registerBody) {
        return await LbdyNetwork.post({url: 'auth/register/', body: registerBody, microService: users, newBaseUrl: newBaseUrl.UserApi})
    }

    static async getFaculties () {
        return await LbdyNetwork.get({url: `registration/`, type: "def", microService: university, newBaseUrl: newBaseUrl.UniversityApi})
    }
    static async getFaculty (id) {
        return await LbdyNetwork.get({url: `faculties/${id}/`,  microService: university, newBaseUrl: newBaseUrl.UniversityApi})
    }

    static async getGroups (facultyId, gradeId) {
        return await LbdyNetwork.get({url: `registration/?faculty_id=${facultyId}&grade_id=${gradeId}`, type: "def", microService: university, newBaseUrl: newBaseUrl.UniversityApi})
    }

    static async usersMe () {
        return await LbdyNetwork.get({url: 'users/me/', microService: users, newBaseUrl: newBaseUrl.UserApi})
    }

    static async refreshToken () {
        return await LbdyNetwork.post({url: `auth/jwt/refresh-token/?refresh_token=${localStorage.getItem(REFRESH_TOKEN)}`, microService: users, newBaseUrl: newBaseUrl.UserApi})
    }

    static async logout () {
        return await LbdyNetwork.post({url: `auth/jwt/logout/?refresh_token=${localStorage.getItem(REFRESH_TOKEN)}`, microService: users, newBaseUrl: newBaseUrl.UserApi})
    }

    static async getUsers () {
        return await LbdyNetwork.get({url:`users/group/my/`, microService: users, newBaseUrl: newBaseUrl.UserApi})
    }
    static async getUser (id) {
        return await LbdyNetwork.get({url:`users/${id}/`, microService: users, newBaseUrl: newBaseUrl.UserApi})
    }
    static async patchMe (userData) {
        if(userData.password === '') {
            delete userData.password
        }
        return await LbdyNetwork.patch({url: 'users/me/', body: userData,  microService: users, newBaseUrl: newBaseUrl.UserApi})
    }
    static async deleteMe () {
        return await LbdyNetwork.delete({url: 'users/me/',  microService: users, newBaseUrl: newBaseUrl.UserApi})
    }
    static async forgotPassword (phone) {
        return await LbdyNetwork.post({url: 'auth/forgot-password/',  microService: users, body: {phone: phone}, newBaseUrl: newBaseUrl.UserApi})
    }
    static async resetPassword (code, token, password) {

        return await LbdyNetwork.post({url: 'auth/reset-password/',  microService: users, body: {token: token, code: code, password: password}, newBaseUrl: newBaseUrl.UserApi})
    }
    static async updateAvatar(file) {
        const body = new FormData()
        if(typeof file === 'object') {
            body.append('file', file)
        }
        return await LbdyNetwork.postFiles({url: 'users/me/update_avatar/', body: body, microService: users, newBaseUrl: newBaseUrl.UserApi})
    }
}
