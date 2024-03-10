import { LuTrash2 } from "react-icons/lu";
import React, { useState } from "react";

export function EmailCompose({ onComposeExit, onComposeEmail, loggedUser }) {
    const [recFilterByToEdit, setRecFilterByEdit] = useState({recipient:""});
    const [subFilterByToEdit, setSubFilterByEdit] = useState({subject:""});

    function handleRecChange(ev) {
        ev.preventDefault(); 

        const { value, name:field } = ev.target;

        setRecFilterByEdit(prevFilter => {
            return { ...prevFilter, [field]: value }
        })
    }

    function handleSubChange(ev) {
        ev.preventDefault(); 

        const { value, name:field } = ev.target

        setSubFilterByEdit(prevFilter => {
            console.log("prev: ", prevFilter)
            return { ...prevFilter, [field]:value }
        })
    }

    function handleSubmit(ev) {
        ev.preventDefault();

        console.log("Submit!", recFilterByToEdit, subFilterByToEdit)
        onComposeEmail({to:recFilterByToEdit.recipient, from: loggedUser, subject:subFilterByToEdit.subject, body:""})
    }
    
  return (
      <section className="email-compose-container">
          <section className="email-compose-header">
              <section className="header-message">
              New Message
              </section>
              <button className="compose-button" onClick={()=>{onComposeExit()}}>X</button>
          </section>
          <form className="compose-inputs">
                <input className="rec-sub"
                    type="email"
                    name="recipient"
                    value={recFilterByToEdit.recipient}
                    placeholder="Recipient"
                    onChange={handleRecChange}
              />
              <input className="rec-sub"
                    type="text"
                    name="subject"
                    value={subFilterByToEdit.subject}
                    placeholder="Subject"
                    onChange={handleSubChange}
              />
              
          </form>

          <section className="email-compose-footer">
            <button className="compose-send-btn" onClick={handleSubmit}>Send</button>
            <button type="button" className="compose-delete-btn"><LuTrash2/></button>
          </section>
          

          
          
          
    </section>
  );
}
