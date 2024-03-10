import { storageService } from "./async-storage.services.js";
import { utilService } from "./util.service.js";

export const emailService = {
  query,
  save,
  remove,
  getById,
};

const STORAGE_KEY = "emails";
_createInputEmails(); // Creates the 'Dummy' email input.

async function query(filterBy) {
  let emails = await storageService.query(STORAGE_KEY);
  let { isRead, searchStr } = filterBy;

  // First, check if should return only "deleted" emails
  if (filterBy.removedAt) {
    return emails.filter((email) => email.removedAt)
  }

  // Else, filter out the 'deleted' emails
  emails = emails.filter((email) => !email.removedAt)


  // Apply filter for search in body and subject
  emails = searchStr
    ? _searchInBody(emails, searchStr)
    : emails;
  
  emails = isRead != undefined ? _applyIsReadFiler(emails, isRead) : emails // Apply filter for 'isRead'
  emails = _applyPageFilter(emails, filterBy) // Apply filter for side branch
  

  return emails
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

function _applyIsReadFiler(emails, filterBy) {
  return emails.filter((email) => {
    if (email.isRead != undefined) {
      return email.isRead === filterBy
    }

    return true;
  });
}

function _searchInBody(emails, searchStr) {
  return emails.filter((email) => {
    searchStr = searchStr && searchStr.toLowerCase();
    const emailBody = email.body.toLowerCase();
    const emailSubject = email.subject.toLowerCase();

    return emailBody.includes(searchStr) || emailSubject.includes(searchStr);
  });
}

function _applyPageFilter(emails, filterBy) {
  return emails.filter((email) => {
    if (filterBy.isStarred) {
      return email.isStarred === filterBy.isStarred
    } else if (filterBy.to) {
      return email.to === filterBy.to
    } else if (filterBy.from) {
      return email.from === filterBy.from
    }

    return emails

  })
}

function _createEmail(email) {
  let id = utilService.makeId();

  return {
    id,
    subject: email.subject,
    body: email.body,
    isRead: false,
    isStarred: false,
    sentAt: _getActualTime(),
    removedAt: null,
    from: email.from,
    to: email.to,
  };
}

function _getActualTime() {
  const currentHour = (new Date()).getHours()
  const timeOfDay = currentHour >= 12 ? 'PM' : 'AM'

  return `${currentHour} ${timeOfDay}`
}
async function _createInputEmails() {
  let emails = utilService.loadFromStorage(STORAGE_KEY);

  if (emails && emails.length) {
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
