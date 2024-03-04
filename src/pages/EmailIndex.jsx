import { useEffect, useState } from "react";
; import { useParams } from "react-router-dom";

import { EmailList } from "../cmps/EmailList";
import { DropDownFilter } from "../cmps/DropDownFilter";
import { SearchFilter } from "../cmps/SearchFilter";
import { EmailDetails } from "./EmailDetails";

import logoUrl from "../assets/imgs/Gmail_Logo_24px.png";
import { emailService } from "../services/email.service"

export function EmailIndex() {
  const [emails, setEmails] = useState(null);
  const [filterBy, setFilterBy] = useState(emailService.getDefaultFilter());

  const [emailId, setEmailId] = useState("");

  const params = useParams();

  useEffect(() => {
    toggleState();
  }, [params.emailId]);

  useEffect(() => {
    loadEmails();
  }, [filterBy]);

  function toggleState() {
    setEmailId(params.emailId);
  }
  function onSetFilter(fieldsToUpdate) {
    setFilterBy((prevFilter) => ({ ...prevFilter, ...fieldsToUpdate }));
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
    console.log("email deleted: ", email.id);

    try {
      await emailService.remove(email.id);

      setEmails((prevEmails) => {
        return prevEmails.filter((filterEmail) => filterEmail.id !== email.id);
      });
    } catch (err) {
      console.log("Error in onRemoveRobot", err);
    }
  }

  async function onEmailRead(email, isRead) {
    const newEmail = { ...email, isRead: isRead };
    console.log("onEmailRead");
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

  return (
    <section className="email-index-container">
      <section className="index-header">
        <section className="gmail-logo-font">
          <img src={logoUrl} alt="Gmail Logo" /> Gmail
        </section>
        <SearchFilter
          filterBy={filterBy}
          onSetFilter={onSetFilter}
          toggleState={toggleState}
        />
      </section>

      {emailId && <EmailDetails emailId={emailId} />}
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
    </section>
  );
}
