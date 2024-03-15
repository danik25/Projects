import { storageService } from "./async-storage.services.js";
import { utilService } from "./util.service.js";
import dummyArr from '../assets/files/dummyArr.json'

export const emailService = {
  query,
  save,
  remove,
  getById,
  getArgumentsFromId,
  getDefaultFilter,
  getCurrentUser,
};

const STORAGE_KEY = "emails";
_createInputEmails(); // Creates the 'Dummy' email input.


function getCurrentUser() {
  return {
    userName: "Dani Benjamin",
    userEmail: "dani@b.com",
  }
}
function getDefaultFilter(filter) {
  return {
    isRead: filter.isRead != null ? filter.isRead : undefined,
    removedAt: null,
  };
}

async function getArgumentsFromId(draftEmailId) {
  try {
    const draftEmail = await getById(draftEmailId);
    return {
      recipient: draftEmail.to,
      subject: draftEmail.subject,
      body: draftEmail.body,
      id: draftEmailId,
    };
  } catch (err) {
    console.log("Failed fetching draft email", err);
  }
}

async function query(filterBy) {
  let emails = await storageService.query(STORAGE_KEY);

  return _applyFilter(emails, filterBy);
}

async function getById(emailId) {
  return storageService.get(STORAGE_KEY, emailId);
}

async function remove(emailId) {
  return storageService.remove(STORAGE_KEY, emailId);
}

async function save(email) {
  if (email.id) {
    const updatedEmail = await storageService.put(STORAGE_KEY, email);
    return updatedEmail;
  } else {
    const newEmail = _createEmail(email);
    return storageService.post(STORAGE_KEY, newEmail);
  }
}

function _applyFilter(emails, filterBy) {
  // Apply filter for search in body and subject
  if (filterBy.searchStr) {
    emails = _searchInBody(emails, filterBy.searchStr);
  }

  if (filterBy.isRead != null) {
    emails = emails.filter((email) => email.isRead === filterBy.isRead);
  }

  if (filterBy.isStarred) {
    emails = emails.filter((email) => email.isStarred === filterBy.isStarred);
  }

  if (filterBy.to) {
    emails = emails.filter((email) => email.to === filterBy.to);
  }

  if (filterBy.from) {
    emails = emails.filter((email) => email.from === filterBy.from);
  }

  if (filterBy.sentAt !== undefined) {
    // null is a valid filter value fir sentAt
    emails = emails.filter((email) => {
      if (filterBy.sentAt === true) {
        return email.sentAt !== null;
      }
      return email.sentAt === filterBy.sentAt;
    });
  }

  if (filterBy.removedAt !== undefined) {
    // null is a valid filter value fir removedAt
    emails = emails.filter((email) => {
      if (filterBy.removedAt === true) {
        return email.removedAt !== null;
      }
      return email.removedAt === filterBy.removedAt;
    });
  }

  return emails;
}

function _searchInBody(emails, searchStr) {
  return emails.filter((email) => {
    searchStr = searchStr && searchStr.toLowerCase();
    const emailBody = email.body.toLowerCase();
    const emailSubject = email.subject.toLowerCase();

    return emailBody.includes(searchStr) || emailSubject.includes(searchStr);
  });
}

function _createEmail(email) {
  let id = utilService.makeId();

  return {
    id,
    subject: email.subject,
    body: email.body,
    isRead: false,
    isStarred: false,
    sentAt: email.sentAt,
    removedAt: null,
    from: email.from,
    to: email.to,
  };
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
  const dummyEmailArr = dummyArr.emails

  return dummyEmailArr
}
