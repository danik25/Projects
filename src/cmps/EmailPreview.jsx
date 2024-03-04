import { GoStarFill } from "react-icons/go";
import { FaRegStar } from "react-icons/fa";

import { useState } from "react";
import { useNavigate } from "react-router";

import { Date } from "./Date";
import { EmailButtons } from "./EmailButtons";

export function EmailPreview({
  email,
  onEmailDelete,
  onEmailRead,
  onEmailStar,
}) {
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
    console.log("Clicked!");
    navigate(`/email/${email.id}`);
    onEmailRead(email, true);
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
      <div className="star" onClick={handleCheckboxChange}>
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
