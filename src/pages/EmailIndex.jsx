import { useEffect, useState } from "react";
import { Outlet, useParams, useSearchParams } from "react-router-dom";

import { EmailList } from "../cmps/EmailList";
import { DropDownFilter } from "../cmps/DropDownFilter";
import { SearchFilter } from "../cmps/SearchFilter";
import { EmailCompose } from "../cmps/EmailCompose";


import logoUrl from "../assets/imgs/Gmail_Logo_24px.png";
import { emailService } from "../services/email.service"

export function EmailIndex({ updateUnreadCount, loggedUser }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [shouldPresentCompose, setShouldPresentCompose] = useState(searchParams.has('compose'))

  const [emails, setEmails] = useState(null)
  const [filterBy, setFilterBy] = useState(searchParams)

  const [filerByPage, setFilerByPage] = useState("inbox")

  const [emailId, setEmailId] = useState("");

  const params = useParams();
 

  useEffect(() => {
    if (searchParams.get("compose") === "new") {
        setShouldPresentCompose(true)
    }
  }, [searchParams])
  // Handle the folder on the side bar
  useEffect(() => {
    dynamicPageState(params.page)
  }, [params.page])

  useEffect(() => {
    toggleState();
  }, [params.emailId]);

  useEffect(() => {
    setSearchParams(filterBy)
    loadEmails();
  }, [filterBy]);


  async function dynamicPageState(page) {
    switch (page) {
      case 'inbox':
        setFilterBy({ to: loggedUser })
        break
      case 'starred':
        setFilterBy({isStarred: true})
        break
      case 'sent':
        setFilterBy({ from: loggedUser })
        break
      case 'trash':
        setFilterBy({ removedAt: !null })
        break
      default:
        // nothing
    }
  }
  function toggleState() {
    setEmailId(params.emailId);
  }

  function onSetFilter(fieldsToUpdate) {
    setFilterBy((prevFilter) => ({ ...prevFilter, ...fieldsToUpdate }));
  }

  async function onComposeExit() {
    setShouldPresentCompose(false)
    setSearchParams("")
  }

  async function onComposeEmail(newEmail) {
    try {
      await emailService.save(newEmail);
      loadEmails(filterBy)
      onComposeExit()

    } catch (err) {
      console.log("Failed while creating new email:", err)
    }
  }
  async function onEmailStar(email, isStarred) {
    const newEmail = { ...email, isStarred: isStarred };

    try {
      const updatedEmail = await emailService.save(newEmail);

      setEmails((prevEmails) =>
        prevEmails.map((currEmail) => {
          return currEmail.id === updatedEmail.id ? updatedEmail : currEmail;
        })
      );
      emailService.save(newEmail);
    } catch (err) {
      console.log("Error in updating email staring", err);
    }
  }
  async function onEmailDelete(email) {
    try {
      // Email is already in 'Trash', should be removed permanently
      if (email.removedAt) { 
        await emailService.remove(email.id);
      } else {
        // Email gets a removal date, and will appear only in 'Trash'
        const removedEmail = { ...email, removedAt: new Date() };
        await emailService.save(removedEmail)
      }
      
      setEmails((prevEmails) => {
        return prevEmails.filter((filterEmail) => filterEmail.id !== email.id);
      });
    } catch (err) {
      console.log("Error while removing email", err);
    }
  }

  async function onEmailRead(email, isRead) {
    const newEmail = { ...email, isRead: isRead };
    console.log("onEmailRead");

    const updateCount = isRead ? -1 : 1;
    updateUnreadCount(updateCount)
    try {
      const updatedEmail = await emailService.save(newEmail);
      console.log("saved: ", updatedEmail);
      setEmails((prevEmails) =>
        prevEmails.map((currEmail) => {
          console.log("currEmail.id: ", currEmail.id);
          console.log("updatedEmail.id: ", updatedEmail.id);
          return currEmail.id === updatedEmail.id ? updatedEmail : currEmail;
        })
      );
    } catch (err) {
      console.log("Error in updating email", err);
    }
  }

  async function loadEmails() {
    try {
      const loadedEmails = await emailService.query(filterBy);
      setEmails(loadedEmails);
    } catch (err) {
      console.log("Error in loadEmails", err);
    }
  }

  if (!emails) {
    return "Loading...";
  }

  const { searchStr } = filterBy

  return (
    <section className="email-index-container">
      <section className="index-header">
        <section className="gmail-logo-font">
          <img src={logoUrl} alt="Gmail Logo" /> Gmail
        </section>
        <SearchFilter
          filterBy={{ searchStr }}
          onSetFilter={onSetFilter}
          toggleState={toggleState}
        />
      </section>

      
      {!emailId && (
        <div className="email-filter-list">
          <DropDownFilter filterBy={filterBy} onSetFilter={onSetFilter} />
          <EmailList
            emails={emails}
            onEmailRead={onEmailRead}
            onEmailDelete={onEmailDelete}
            onEmailStar={onEmailStar}
          />
        </div>
      )}
      <Outlet />

      {shouldPresentCompose && <EmailCompose onComposeExit={onComposeExit} onComposeEmail={onComposeEmail} loggedUser={loggedUser} />}
      
    </section>
  );
}
