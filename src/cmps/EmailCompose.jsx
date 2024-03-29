import { useSearchParams } from "react-router-dom";

import { LuTrash2 } from "react-icons/lu";
import { CgExpand } from "react-icons/cg";
import { MdMinimize } from "react-icons/md";
import { ImShrink2 } from "react-icons/im";

import { eventBusService } from "../services/event-bus.service";
import { utilService } from "../services/util.service";
import { emailService } from "../services/email.service";

import React, { useEffect, useState, useRef } from "react";

export function EmailCompose({ onComposeExit, onComposeEmail, loggedUser }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const timeoutIdRef = useRef();
  const [emailId, setEmailId] = useState(null);

  const [emailEdit, setEmailEdit] = useState({
    recipient: "",
    subject: "",
    body: "",
  });

  const [viewState, setViewState] = useState("normal");

  useEffect(() => {
    let searchParamsCompose = searchParams.get("compose");
    if (searchParamsCompose && searchParamsCompose !== "new") {
      setEmailId(searchParamsCompose);
      assignFormValues(searchParamsCompose);
    }

    if (!searchParamsCompose) {
      saveDraft();
    }
  }, [searchParams]);

  useEffect(() => {
    timeoutIdRef.current = setTimeout(() => {
      saveDraft();
    }, 5000);

    return () => {
      console.log("clear timeout");
      clearTimeout(timeoutIdRef.current);
    };
  }, [emailEdit]);

  async function assignFormValues(draftEmailId) {
    // Place the original values
    const emailValues = await emailService.getArgumentsFromId(draftEmailId);
    setEmailEdit(emailValues);
  }
  async function saveDraft() {
    await createEmail({
      to: emailEdit.recipient,
      from: loggedUser.userName,
      subject: emailEdit.subject,
      body: emailEdit.body,
      sentAt: null,
    })
  }

  async function createEmail(newEmail) {
    try {
      const { id } = await emailService.save({
        to: emailEdit.recipient,
        from: loggedUser.userName,
        subject: emailEdit.subject,
        body: emailEdit.body,
        sentAt: newEmail.sentAt,
        removedAt: null,
        id: emailId
      });

      if (!emailId) {
        setEmailId(id)
      } 

      await onComposeEmail();

    } catch (err) {
      console.log("Failed creating email draft ", err)

      eventBusService.emit("custom-msg", {
        txt: "Draft failed",
        type: "failure",
      });
    }
  }

  function handleChange(ev) {
    let { value, name: field } = ev.target;

    setEmailEdit((prevFilter) => {
      console.log(prevFilter);
      return { ...prevFilter, [field]: value };
    });
  }

  async function handleExit() {
    await saveDraft();
    onComposeExit();
  }

  async function handleSubmit(ev) {
    ev.preventDefault();

    const composeTime = utilService.createTime();

    await createEmail({
      to: emailEdit.recipient,
      from: loggedUser.userName,
      subject: emailEdit.subject,
      body: emailEdit.body,
      sentAt: composeTime,
      id: emailId,
    });

    onComposeExit();

    eventBusService.emit("custom-msg", {
      txt: "Message Sent",
      type: "success",
    });
  }

  function handleExpandShrink(value) {
    setViewState(value);
  }

  return (
    <section className={"email-compose-container " + viewState}>
      <section className="email-compose-header">
        <section className="header-message">New Message</section>
        <section className="compose-header-buttons">
          <button type="button" className="compose-minimize-btn">
            <MdMinimize />
          </button>

          {viewState !== "expand" && (
            <button
              type="button"
              className="compose-e-s-btn"
              onClick={() => {
                handleExpandShrink("expand");
              }}
            >
              <CgExpand />
            </button>
          )}
          {viewState === "expand" && (
            <button
              type="button"
              className="compose-e-s-btn"
              onClick={() => {
                handleExpandShrink("normal");
              }}
            >
              <ImShrink2 />
            </button>
          )}

          <button
            className="compose-exit-button"
            onClick={() => {
              handleExit();
            }}
          >
            X
          </button>
        </section>
      </section>
      <form className="compose-inputs" onSubmit={handleSubmit}>
        <input
          className="rec-sub"
          type="email"
          name="recipient"
          value={emailEdit.recipient}
          placeholder="Recipient"
          onChange={handleChange}
          required
        />
        <input
          className="rec-sub"
          type="text"
          name="subject"
          value={emailEdit.subject}
          placeholder="Subject"
          onChange={handleChange}
        />
        <textarea
          className="compose-body"
          type="text"
          name="body"
          value={emailEdit.body}
          onChange={handleChange}
        />

        <section className="email-compose-footer">
          <button type="submit" className="compose-send-btn">
            Send
          </button>
          <button className="compose-delete-btn">
            <LuTrash2 />
          </button>
        </section>
      </form>
    </section>
  );
}
