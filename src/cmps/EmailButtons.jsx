import { LuTrash2 } from "react-icons/lu";
import { FaRegEnvelopeOpen } from "react-icons/fa6";
import { FaRegEnvelope } from "react-icons/fa";

import { useState } from "react";

export function EmailButtons({ email, onEmailDelete, onEmailRead }) {
  const [isRead, setReadButton] = useState(email.isRead);

  function onClickRead() {
    setReadButton((prev) => {
      onEmailRead(email, !prev);
      return !prev;
    });
  }

  const readIcon = isRead ? <FaRegEnvelopeOpen /> : <FaRegEnvelope />;
  return (
    <section className="button-container">
      <button className="custom-button" onClick={() => onEmailDelete(email)}>
        <LuTrash2 />
      </button>
      <button className="custom-button" onClick={() => onClickRead()}>
        {readIcon}
      </button>
    </section>
  );
}
