import { EmailPreview } from "./EmailPreview";

export function EmailList({ emails, onEmailRead, onEmailDelete, onEmailStar }) {
  console.log("emails: ", emails);

  return (
    <div className="email-list">
      <ul>
        {emails.map((email) => {
          return (
            <li key={email.id}>
              <EmailPreview
                email={email}
                onEmailDelete={onEmailDelete}
                onEmailRead={onEmailRead}
                onEmailStar={onEmailStar}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
