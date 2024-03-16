import { useSearchParams } from "react-router-dom";

import { GoStarFill } from "react-icons/go";
import { FaRegStar } from "react-icons/fa";

import { useState } from "react";
import { useNavigate } from "react-router";

import { Date } from "./Date";
import { EmailButtons } from "./EmailButtons";
import { emailService } from "../services/email.service";

export function EmailPreview({
  email,
  onEmailDelete,
  onEmailRead,
  onEmailStar,
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  // TODO: create option to present time of a draft
  // const presentedTime = email.sentAt
  //   if(!email.sentAt) {
  //     presentedTime = utilService.createTime()
  //   }

  const [emailRightSide, setEmailRightSide] = useState(
    <Date date={email.sentAt} />
  );

  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    onEmailStar(email, !email.isStarred);
  };

  function onEmailHovered() {
    setEmailRightSide(
      <EmailButtons
        email={email}
        onEmailDelete={onEmailDelete}
        onEmailRead={onEmailRead}
      />
    );
  }

  function onEmailUnHovered() {
    setEmailRightSide(<Date date={email.sentAt} />);
  }

  function handleEmailClick() {
    if (email.sentAt) {
      // In case sentAt exists, the email is not 'draft'
      navigate(`/mail/inbox/${email.id}`);
      onEmailRead(email, true);
    } else {
      setSearchParams({ compose: email.id });
    }
  }

  const isReadClass = email.isRead ? "read" : "";
  const isStarMarked = email.isStarred ? (
    <section className="clicked">
      <GoStarFill />
    </section>
  ) : (
    <FaRegStar />
  );

  return (
    <div
      className={`email-preview-container ${isReadClass}`}
      onMouseOver={onEmailHovered}
      onMouseOut={onEmailUnHovered}
    >
      <input className="email-preview-checkbox" type="checkbox"></input>
      <div className="email-preview-star" onClick={handleCheckboxChange}>
        {isStarMarked}
      </div>
      <section className="clickable-section" onClick={() => handleEmailClick()}>
        <section className="from"> {email.from} </section>
        <section className="subject-and-body">
          <section className="email-subject"> {email.subject} </section>
          <section className="email-body"> {email.body}</section>
        </section>
      </section>

      <section className="date-buttons"> {emailRightSide}</section>
    </div>
  );
}
