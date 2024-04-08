import newBaseUrl from "shared/config/baseUrlConfig";
import LbdyNetwork from "shared/config/httpConfig";

const knb = 'knb';
export default class KnowlegeBaseApi {
  static async getDocuments(status = true, skip = 0, limit = 25, text_search, grade, semester, teacher, subject, type) {
    const gradeParams = (grade !== '' && grade !== 0) ? `&grade=${grade}` : '';
    const textSearchParams = (text_search !== '' && text_search !== undefined) ? `&text_search=${text_search}` : '';
    const semesterParams = (semester !== '' && semester !== 0) ? `&semester=${semester}` : '';
    const teacherParams = teacher ? `&teacher=${teacher}` : '';
    const subjectParams = subject ? `&subject=${subject}` : '';
    const typeParams = type ? `&type=${type}` : '';
    return await LbdyNetwork.get({
      url: `documents/?skip=${skip}&limit=${limit}&public=${status}${textSearchParams}${gradeParams}${semesterParams}${teacherParams}${subjectParams}${typeParams}`,
      microService: knb,
      newBaseUrl: newBaseUrl.KNBApi
    })
  }

  static async getProjectDouments(id, origin = "Файл") {
    return await LbdyNetwork.get({
      url: `documents/${id}/?origin=${origin}`,
      microService: knb,
      newBaseUrl: newBaseUrl.KNBApi
    })
  }

  static async createDocument({ origin, name, description, url, grade = 0, semester = 0, teacher = null, subject = null, type = 'Другое', isPublic, project_id = null }) {
    return await LbdyNetwork.post({
      url: `documents/`, body: {
        origin: origin,
        name: name,
        description: description,
        url: url,
        grade: grade,
        semester: semester,
        teacher: teacher,
        subject: subject,
        type: type,
        public: isPublic,
        project_id: project_id
      }, microService: knb,
      newBaseUrl: newBaseUrl.KNBApi
    })
  }

  static async deleteDocument(id) {
    return await LbdyNetwork.delete({ url: `documents/${id}/`, microService: knb, newBaseUrl: newBaseUrl.KNBApi })
  }

  static async patchDocument(id, isPublic) {
    return await LbdyNetwork.patch({ url: `documents/${id}/?public=${isPublic}`, microService: knb, newBaseUrl: newBaseUrl.KNBApi })
  }

  static async sendFiles(files) {
    const body = new FormData()
    if (files.length !== 0) {
      for (let i = 0; i <= files.length - 1; i++) {
        body.append('file', files[i])
      }
    }

    return await LbdyNetwork.postFiles({ url: `documents/upload/`, body: body, microService: knb, newBaseUrl: newBaseUrl.KNBApi })
  }

  static async getProjectDocuments(id, origin, skip, limit) {
    return await LbdyNetwork.get({ url: `documents/${id}/?origin=${origin}&skip=${skip}&limit=${limit}`, microService: knb, newBaseUrl: newBaseUrl.KNBApi })
  }
}