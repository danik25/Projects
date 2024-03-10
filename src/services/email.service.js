import { storageService } from "./async-storage.services.js";
import { utilService } from "./util.service.js";

export const emailService = {
  query,
  save,
  remove,
  getById,
  getArgumentsFromId,
};

const STORAGE_KEY = "emails";
_createInputEmails(); // Creates the 'Dummy' email input.

async function getArgumentsFromId(draftEmailId) {
  try {
    const draftEmail = await getById(draftEmailId)
    return {recipient: draftEmail.to, subject: draftEmail.subject, body: draftEmail.body, id:draftEmailId }
  } catch (err) {
    console.log("Failed fetching draft email", err)
  } 
   
  
}

async function query(filterBy) {
  let emails = await storageService.query(STORAGE_KEY);
  let { isRead, searchStr } = filterBy;

    
  // Apply filter for search in body and subject
  emails = searchStr
    ? _searchInBody(emails, searchStr)
    : emails;
  
  emails = isRead != undefined ? _applyIsReadFiler(emails, isRead) : emails // Apply filter for 'isRead'

  emails = emails.filter((email) => filterBy.isStarred ? email.isStarred === filterBy.isStarred : true) // starred
  emails = emails.filter((email) => filterBy.to ? email.to === filterBy.to : true) // to
  emails = emails.filter((email) => filterBy.from ? email.from === filterBy.from : true) // from

  // sentAt
  emails = filterBy.sentAt === undefined ? emails : emails.filter((email) => {
    if (filterBy.sentAt && filterBy.sentAt === true) {
      return email.sentAt !== null
    }
    return email.sentAt === filterBy.sentAt
  })

  // removedAt
  emails = filterBy.removedAt === undefined ? emails : emails.filter((email) => {
    if (filterBy.removedAt && filterBy.removedAt === true) {
      return email.removedAt !== null
    }
    return email.removedAt === filterBy.removedAt
  })
  
  return emails
}


async function getById(emailId) {
  return storageService.get(STORAGE_KEY, emailId);
}

async function remove(emailId) {
  return storageService.remove(STORAGE_KEY, emailId);
}

async function save(email) {
  if (email.id) {
    const updatedEmail = await storageService.put(STORAGE_KEY, email)
    return updatedEmail
  } else {
    const newEmail = _createEmail(email)
    return storageService.post(STORAGE_KEY, newEmail)
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
  const dummyEmailArr = await fetch("./src/assets/files/dummyArr.json");

  if (!dummyEmailArr.ok) {
    console.log("Couldn't fetch dummy email list");
  }

  const data = await dummyEmailArr.json();
  return data.emails;
}
