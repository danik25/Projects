import { storageService } from "./async-storage.services.js";
import { utilService } from "./util.service.js";

export const userService = {
  query,
  save,
  remove,
  getById,
};

const STORAGE_KEY = "users";
_createInitialUsers();

async function query() {
  return await storageService.query(STORAGE_KEY);
}

async function getById(userId) {
  return storageService.get(STORAGE_KEY, userId);
}

async function remove(userId) {
  return storageService.remove(STORAGE_KEY, userId);
}

async function save(user) {
  if (user.id) {
    const updatedUser = await storageService.put(STORAGE_KEY, user);
    return updatedUser;
  } else {
    const newUser = _createUser(email);
    return storageService.post(STORAGE_KEY, newUser);
  }
}

function _createUser(user) {
  let id = utilService.makeId();

  return {
    id,
    userName: user.userName,
    userEmail: user.userEmail,
  };
}

async function _createInitialUsers() {
  let users = utilService.loadFromStorage(STORAGE_KEY);

  if (users && users.length) {
    return;
  }

  const dummyUser = {
    userName: "Dani Benjamin",
    userEmail: "DaniBenjamin46@gmail.com",
  };

  utilService.saveToStorage(STORAGE_KEY, [dummyUser]);
}
