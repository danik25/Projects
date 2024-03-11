import { RxHamburgerMenu } from "react-icons/rx";


import { useEffect, useState } from "react";
import { Outlet, useParams, useSearchParams } from "react-router-dom";

import { EmailList } from "../cmps/EmailList";
import { DropDownFilter } from "../cmps/DropDownFilter";
import { SearchFilter } from "../cmps/SearchFilter";
import { EmailCompose } from "../cmps/EmailCompose";
import { CustomMsg } from "../cmps/CustomMsg";
import { SideBar } from "../cmps/SideBar";

import {eventBusService} from '../services/event-bus.service'


import logoUrl from "../assets/imgs/Gmail_Logo_24px.png";
import { emailService } from "../services/email.service"

export function EmailIndex() {
  const loggedUser = "Dani Benjamin"

  const params = useParams();

  const [searchParams, setSearchParams] = useSearchParams()
  
  const [shouldPresentCompose, setShouldPresentCompose] = useState(searchParams.has('compose'))
  const [emails, setEmails] = useState(null)
  const [filterBy, setFilterBy] = useState(searchParams)
  const [emailId, setEmailId] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadCount()
  }, [])
  
  
  useEffect(() => {
    if (searchParams.has("compose")) {
      setShouldPresentCompose(true)
    }
  }, [searchParams])

  // Handle the change in the side bar folder (URL params)
  useEffect(() => {
    folderChange(params.folder)
  }, [params.folder])

  useEffect(() => {
    toggleState();
  }, [params.emailId]);

  useEffect(() => {
    setSearchParams(filterBy)
    loadEmails();
  }, [filterBy]);


  async function loadCount() {
    const count = await emailService.query({ isRead: false, to: loggedUser })
    setUnreadCount(count.length)
  }
  function updateUnreadCount(newCount) {
    setUnreadCount((prevCount) => prevCount + newCount)
  }

  async function folderChange(folder) {
    // Get existing search params for relevant filters (isRead)
    const currentFilter = emailService.getDefaultFilter(searchParams)
    console.log("currentFilter:", currentFilter)
    switch (folder) {
      case 'inbox':
        setFilterBy( { ...currentFilter, to: loggedUser, sentAt: !null })
        break
      case 'starred':
        setFilterBy( {...currentFilter, isStarred: true})
        break
      case 'sent':
        setFilterBy( { ...currentFilter,from: loggedUser, sentAt: !null })
        break
      case 'trash':
        setFilterBy( { ...currentFilter, removedAt: !null })
        break
      case 'drafts':
        setFilterBy( { ...currentFilter, sentAt: null,  from: loggedUser})
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
    console.log("email compose")
    try {
      const currentEmail = newEmail.id ? await emailService.getById(newEmail.id) : {}
      const savedEmail = await emailService.save({ ...currentEmail, ...newEmail })

      setSearchParams({ compose: savedEmail.id })
      loadEmails(filterBy)
    } catch (err) {
      eventBusService.emit('custom-msg',{txt:"Failed to create a new email.", type:'failure'})
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
      await emailService.save(newEmail);
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
        <section className="email-index-header-hamb-n-logo">
          <section className="email-index-header-hamb" ><RxHamburgerMenu /></section>
          <section className="email-index-header-gmail-logo">
            <img src={logoUrl} alt="Gmail Logo" /> Gmail
          </section>
        </section>
        
        <SearchFilter
          filterBy={{ searchStr }}
          onSetFilter={onSetFilter}
          toggleState={toggleState}
        />
      </section>

      <section className="email-index-sidebar">
        < SideBar unreadCount={unreadCount} />
      </section>
      
      
      <section className="email-index-main">
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
        {emailId && <Outlet />}
      </section>

      <section className="email-index-right"></section>
      
      
      {shouldPresentCompose && <EmailCompose onComposeExit={onComposeExit} onComposeEmail={onComposeEmail} loggedUser={loggedUser} />}
      <CustomMsg/>
      
      
    </section>
  );
}
