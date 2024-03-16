import { RxHamburgerMenu } from "react-icons/rx";

import { useEffect, useState } from "react";
import { Outlet, useParams, useSearchParams } from "react-router-dom";

import { EmailList } from "../cmps/EmailList";
import { DropDownFilter } from "../cmps/DropDownFilter";
import { SearchFilter } from "../cmps/SearchFilter";
import { EmailCompose } from "../cmps/EmailCompose";
import { CustomMsg } from "../cmps/CustomMsg";
import { SideBar } from "../cmps/SideBar";
import { EmptyFolder } from "../cmps/EmptyFolder";

import { eventBusService } from "../services/event-bus.service";

import logoUrl from "../assets/imgs/Gmail_Logo_24px.png";
import { emailService } from "../services/email.service";

export function EmailIndex() {
  const params = useParams();

  const [searchParams, setSearchParams] = useSearchParams();

  const [loggedUser, setLoggedUser] = useState(emailService.getCurrentUser());
  const [shouldRenderCompose, setShouldRenderCompose] = useState(
    searchParams.has("compose")
  );
  const [emails, setEmails] = useState(null);
  const [filterBy, setFilterBy] = useState(searchParams);
  const [emailId, setEmailId] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // TODO: make the user go to 'inbox' from '/mail/'
    // if (!params) {
    //   navigate(`/mail/inbox`)
    // }
    loadCount();
  }, []);

  useEffect(() => {
    if (searchParams.has("compose")) {
      setShouldRenderCompose(true);
    }
  }, [searchParams]);

  // Handle the change in the side bar folder (URL params)
  useEffect(() => {
    folderChange(params.folder);
  }, [params.folder, loggedUser]);

  useEffect(() => {
    toggleListDetailsState();
  }, [params.emailId]);

  useEffect(() => {
    setSearchParams(filterBy);
    loadEmails();
  }, [filterBy]);

  function handleHambClick() {
    setIsOpen((prevState) => !prevState)
  }

  async function loadCount() {
    const count = await emailService.query({
      isRead: false,
      to: loggedUser.userName,
    });
    setUnreadCount(count.length);
  }
  function updateUnreadCount(newCount) {
    setUnreadCount((prevCount) => prevCount + newCount);
  }

  async function folderChange(folder) {
    // Get existing search params for relevant filters (isRead)
    const currentFilter = emailService.getDefaultFilter(filterBy);
    console.log("currentFilter:", currentFilter);
    switch (folder) {
      case "inbox":
        setFilterBy({ ...currentFilter, to: loggedUser.userName, sentAt: !null });
        break;
      case "starred":
        setFilterBy({ ...currentFilter, isStarred: true });
        break;
      case "sent":
        setFilterBy({
          ...currentFilter,
          from: loggedUser.userName,
          sentAt: !null,
        });
        break;
      case "trash":
        setFilterBy({ ...currentFilter, removedAt: !null });
        break;
      case "drafts":
        setFilterBy({
          ...currentFilter,
          sentAt: null,
          from: loggedUser.userName,
        });
        break;
      default:
      // nothing
    }
  }
  function toggleListDetailsState() {
    setEmailId(params.emailId);
  }

  function onSetFilter(fieldsToUpdate) {
    setFilterBy((prevFilter) => ({ ...prevFilter, ...fieldsToUpdate }));
  }

  async function onComposeExit() {
    setShouldRenderCompose(false);
    setSearchParams("");
  }

  function onComposeEmail() {
    console.log("email compose");
    loadEmails(filterBy);
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
      eventBusService.emit("custom-msg", {
        txt: "Failed to starring an email.",
        type: "failure",
      });
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
        await emailService.save(removedEmail);
      }

      setEmails((prevEmails) => {
        return prevEmails.filter((filterEmail) => filterEmail.id !== email.id);
      });
    } catch (err) {
      eventBusService.emit("custom-msg", {
        txt: "Failed to delete an email.",
        type: "failure",
      });
      console.log("Error while removing email", err);
    }
  }

  async function onEmailRead(email, isRead) {
    const newEmail = { ...email, isRead: isRead };
    console.log("onEmailRead");

    const updateCount = isRead ? -1 : 1;
    updateUnreadCount(updateCount);
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
      console.log("Error in updating an email as 'read'", err);
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

  const { searchStr } = filterBy;
  const presentedEmails = emails.length ? (
    <EmailList
      emails={emails}
      onEmailRead={onEmailRead}
      onEmailDelete={onEmailDelete}
      onEmailStar={onEmailStar}
    />
  ) : (
    <EmptyFolder />
  );

  const openClass = isOpen ? "open" : ""
  return (
    <section className="email-index-container">
      <section className="index-header">
        <section className="email-index-header-hamb-n-logo">
          <button className="email-index-header-hamb-btn" onClick={() => {handleHambClick() }}>
            <RxHamburgerMenu />
          </button>
          <section className="email-index-header-gmail-logo">
            <img src={logoUrl} alt="Gmail Logo" /> Gmail
          </section>
        </section>

        <SearchFilter
          filterBy={{ searchStr }}
          onSetFilter={onSetFilter}
          toggleListDetailsState={toggleListDetailsState}
        />
      </section>

      <section className="email-index-non-header">
        <section className={`email-index-sidebar ${openClass}`}>
          <SideBar unreadCount={unreadCount} isOpen={isOpen} />
        </section>

        <section className="email-index-main">
          {!emailId && (
            <div className="email-filter-list">
              <DropDownFilter filterBy={filterBy} onSetFilter={onSetFilter} />
              {presentedEmails}
            </div>
          )}
          {emailId && <Outlet />}
        </section>

        <section className="email-index-right"></section>

          {shouldRenderCompose && (
            <EmailCompose
              onComposeExit={onComposeExit}
              onComposeEmail={onComposeEmail}
              loggedUser={loggedUser}
            />
          )}
          <CustomMsg />
        </section>
      </section>
      
  );
}
