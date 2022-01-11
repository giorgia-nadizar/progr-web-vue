import axios from "axios";

export const UserHelper = {
  isUnique,
  createUser,
  login,
  logout,
  getLoggedUser,
  editUser,
  getUser,
  deleteUser,
  getUsernames,
  changePassword,
  getUsers,
  passwordRecovery,
};

async function isUnique(value) {
  let unique = true;
  if (value && value.length) {
    try {
      let resp = await axios.get(
        `${process.env.VUE_APP_APIROOT}/user/isUnique/${encodeURIComponent(
          value
        )}`
      );
      unique = resp.data;
      return unique;
    } catch (error) {
      // c'è stato un errore sul server imprevisto
    }
  }
  return unique;
}

function createUser(user) {
  return axios.put(`${process.env.VUE_APP_APIROOT}/user`, user);
}

function login(username, password) {
  return axios
    .get(`${process.env.VUE_APP_APIROOT}/user/login/${username}/${password}`)
    .then((res) => {
      if (res) {
        localStorage.setItem("user", JSON.stringify(res.data));
      }
      return res.data;
    });
}

function logout() {
  localStorage.removeItem("user");
}

function getLoggedUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function editUser(user) {
  return axios.patch(`${process.env.VUE_APP_APIROOT}/user`, user);
}

function getUser(username) {
  return axios.get(
    `${process.env.VUE_APP_APIROOT}/user/${encodeURIComponent(username)}`
  );
}

function deleteUser(username) {
  return axios.delete(
    `${process.env.VUE_APP_APIROOT}/user/${encodeURIComponent(username)}`
  );
}

function getUsers(role) {
  return axios.get(`${process.env.VUE_APP_APIROOT}/user/getUsers/${role}`);
}

function getUsernames(role) {
  return axios.get(`${process.env.VUE_APP_APIROOT}/user/getUsernames/${role}`);
}

function changePassword(password) {
  return axios.patch(
    `${process.env.VUE_APP_APIROOT}/user/changePassword`,
    password
  );
}

function passwordRecovery(username) {
  return axios.get(
    `${process.env.VUE_APP_APIROOT}/user/passwordRecovery/${username}`
  );
}
