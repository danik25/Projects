import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

import { HomePage } from "./pages/HomePage";
import { AboutUs } from "./pages/AboutUs";
import { EmailIndex } from "./pages/EmailIndex";
import { EmailDetails } from "./pages/EmailDetails";

import { SideBar } from "./cmps/SideBar";
import { emailService } from "./services/email.service";


export function App() {
  const loggedUser = "Dani Benjamin"
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadCount()
  }, [])
  
  async function loadCount() {
    const count = await emailService.query({ isRead: false, to: loggedUser } )
    setUnreadCount(count.length)
  }
  function updateUnreadCount(newCount) {
    setUnreadCount((prevCount) => prevCount + newCount)
  }

  return (
    <Router>
      <section className="main-app">
        <SideBar unreadCount={unreadCount} />
        <main className="main-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/mail">
              <Route path="/mail/:page" element={<EmailIndex updateUnreadCount={updateUnreadCount} loggedUser={loggedUser} />}>
                <Route path="/mail/:page/:emailId" element={<EmailDetails />} />
              </Route>
            </Route>
          </Routes>
        </main>
      </section>
    </Router>
  );
}
