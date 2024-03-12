import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router";

import { emailService } from "../services/email.service";
import { eventBusService } from "../services/event-bus.service";

export function EmailDetails() {
  const [email, setEmail] = useState(null);
  const navigate = useNavigate();
  const { emailId } = useParams();

  useEffect(() => {
    loadEmail();
  }, []);

  async function loadEmail() {
    try {
      const email = await emailService.getById(emailId);
      setEmail(email);
    } catch (err) {
      navigate("/mail/inbox");

      eventBusService.emit("custom-msg", {
        txt: "Failed to open requested email",
        type: "failure",
      });
      console.log("Failed to load emails", err);
    }
  }

  if (!email) return <div>Loading..</div>;
  return (
    <section className="email-details-container">
      <section className="email-content">
        <section className="email-details-header">{email.subject}</section>
        <section className="address">
          <section className="email-details-from"> {email.from} </section>
          <section className="email-details-to"> to: {email.to} </section>
        </section>

        <section className="email-details-body">{email.body}</section>
      </section>

      <section className="email-buttons">
        <button className="email-details-button"> ↰ Replay</button>
        <button className="email-details-button"> ↱ Forward </button>
      </section>
    </section>
  );
}
