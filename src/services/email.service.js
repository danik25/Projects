import { storageService } from "./async-storage.services.js";
import { utilService } from "./util.service.js";

export const emailService = {
  query,
  save,
  remove,
  getById,
  getDefaultFilter,
};

const STORAGE_KEY = "emails";
_createInputEmails(); // Only create the input emails at this point

async function query(filterBy) {
  let emails = await storageService.query(STORAGE_KEY);
  let { isRead, substring } = filterBy;

  if (filterBy) {
    emails = emails.filter((email) => {
      substring = substring.toLowerCase();
      const emailBody = email.body.toLowerCase();
      const emailSubject = email.subject.toLowerCase();

      const includesSubString =
        emailBody.includes(substring) || emailSubject.includes(substring);

      if (isRead != undefined) {
        return email.isRead === isRead && includesSubString;
      }

      return includesSubString;
    });
  }

  return emails;
}

function getDefaultFilter() {
  return {
    isRead: undefined,
    substring: "",
  };
}

async function getById(emailId) {
  return storageService.get(STORAGE_KEY, emailId);
}

async function remove(emailId) {
  return storageService.remove(STORAGE_KEY, emailId);
}

function save(email) {
  if (email.id) {
    return storageService.put(STORAGE_KEY, email);
  } else {
    const newEmail = _createEmail(email);
    return storageService.post(STORAGE_KEY, newEmail);
  }
}

function _createEmail(email) {
  let id = utilService.makeId();

  return {
    id,
    subject: email.subject,
    body: email.body,
    isRead: email.isRead,
    isStarred: email.isStarred,
    sentAt: email.sentAt,
    removedAt: email.removedAt,
    from: email.from,
    to: email.to,
  };
}

async function _createInputEmails() {
  let emails = utilService.loadFromStorage(STORAGE_KEY);

  if (emails || emails.length) {
    return;
  }
  const dummyEmailsArray = await getDummyArr();
  const dummyEmails = dummyEmailsArray.map((dummyEmail) => {
    return _createEmail(dummyEmail);
  });

  utilService.saveToStorage(STORAGE_KEY, dummyEmails);
}

async function getDummyArr() {
  const dummyEmailArr = await fetch("./src/assets/files/dummyArr.json");

  if (!dummyEmailArr.ok) {
    console.log("Couldn't fetch dummy email list");
  }

  const data = await dummyEmailArr.json();
  return data.emails;
}
