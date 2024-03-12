import { FaMagnifyingGlass } from "react-icons/fa6";

export function Header() {
  return (
    <section className="app-header">
      <section className="container">
        <section className="search-bar">
          <FaMagnifyingGlass />
          Search in mail
        </section>
      </section>
    </section>
  );
}
