import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL + "/notification";

export function getNotifications() {
  return axios.get(API_URL);
}

export function createNotification(data) {
  return axios.post(API_URL, { data });
}
