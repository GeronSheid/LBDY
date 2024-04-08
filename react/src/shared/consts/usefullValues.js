import jwtDecode from "jwt-decode";

export const myGroupId = localStorage.token !== undefined ? jwtDecode(localStorage.token).group_id : '';
export const myId = jwtDecode(localStorage.token).sub;
export const currentDate = new Date().toISOString().slice(0, 10);
