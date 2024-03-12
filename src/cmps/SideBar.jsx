import { BiSolidInbox } from "react-icons/bi";
import { MdStarBorder } from "react-icons/md";
import { MdOutlineSend } from "react-icons/md";
import { LuTrash2 } from "react-icons/lu";
import { RiDraftLine } from "react-icons/ri";
import { MdOutlineModeEdit } from "react-icons/md";

import { NavLink } from "react-router-dom";

import { Outlet, useSearchParams } from "react-router-dom";

export function SideBar({ unreadCount }) {
  // Search params, for 'compose'
  const [searchParams, setSearchParams] = useSearchParams();

  const folderArr = [
    { path: "starred", icon: <MdStarBorder /> },
    { path: "sent", icon: <MdOutlineSend /> },
    { path: "trash", icon: <LuTrash2 /> },
    { path: "drafts", icon: <RiDraftLine /> },
  ];

  function handleClick() {
    setSearchParams({ compose: "new" });
  }

  const navs = folderArr.map((nav) => (
    <NavLink
      key={nav.path}
      className="side-bar-single-nav"
      to={`/mail/${nav.path}`}
    >
      <section className="side-bar-icon">{nav.icon}</section>
      {nav.path}
    </NavLink>
  ));

  return (
    <div className="side-bar-container">
      <button className="side-bar-compose" onClick={() => handleClick()}>
        <section className="side-bar-icon">
          <MdOutlineModeEdit />
        </section>
        Compose
      </button>

      <nav className="side-bar-navs">
        <NavLink className="side-bar-single-nav" to="/mail/inbox">
          <section className="side-bar-icon">
            <BiSolidInbox />
          </section>
          Inbox
          <section className="side-bar-single-nav-number">
            {unreadCount}
          </section>
        </NavLink>

        {navs}
      </nav>
    </div>
  );
}
