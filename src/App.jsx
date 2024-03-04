import { Route, HashRouter as Router, Routes } from "react-router-dom";

import { HomePage } from "./pages/HomePage";
import { AboutUs } from "./pages/AboutUs";
import { EmailIndex } from "./pages/EmailIndex";
import { EmailDetails } from "./pages/EmailDetails";

import { SideBar } from "./cmps/SideBar";
import { Header } from "./cmps/Header";

export function App() {
  return (
    <Router>
      <section className="main-app">
        {/* <SideBar /> */}
        <main className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/email" element={<EmailIndex />}>
              <Route path="/email/:emailId" element={<EmailDetails />} />
            </Route>
          </Routes>
        </main>
      </section>
    </Router>
  );
}
