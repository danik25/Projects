import { Route, HashRouter as Router, Routes } from "react-router-dom";

import { HomePage } from "./pages/HomePage";
import { AboutUs } from "./pages/AboutUs";
import { EmailIndex } from "./pages/EmailIndex";
import { EmailDetails } from "./pages/EmailDetails";

export function App() {
  return (
    <Router>
      <section className="main-app">
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/mail/:folder" element={<EmailIndex />}>
              <Route path="/mail/:folder/:emailId" element={<EmailDetails />} />
            </Route>
          </Routes>
        </main>
      </section>
    </Router>
  );
}
