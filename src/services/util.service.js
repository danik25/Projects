export const utilService = {
  makeId,
  saveToStorage,
  loadFromStorage,
  createTime,
};

function makeId(length = 5) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function saveToStorage(key, value) {
  localStorage[key] = JSON.stringify(value);
}

function loadFromStorage(key, defaultValue = null) {
  var value = localStorage[key] || defaultValue;
  return JSON.parse(value);
}

function createTime() {
  const currentHour = (new Date()).getHours()
  const currentMinute = (new Date()).getMinutes()
  const timeOfDay = currentHour >= 12 ? 'PM' : 'AM'
  return `${currentHour}:${currentMinute} ${timeOfDay}`
}
