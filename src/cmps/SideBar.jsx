import { BiSolidInbox } from "react-icons/bi";
import { MdStarBorder } from "react-icons/md";
import { MdOutlineSend } from "react-icons/md";
import { LuTrash2 } from "react-icons/lu";
import { RiDraftLine } from "react-icons/ri";
import { MdOutlineModeEdit } from "react-icons/md";

import { NavLink } from "react-router-dom"

import { Outlet, useSearchParams } from "react-router-dom";

export function SideBar({unreadCount}) {
    // Search params, for 'compose'
    const [searchParams, setSearchParams] = useSearchParams() 
    
    function handleClick() {
        setSearchParams({compose:'new'})
    }
    return (
        <div className="side-bar-container">
            <button className="side-bar-compose" onClick={() => handleClick()}>
                <section className="side-bar-icon">
                    <MdOutlineModeEdit/>
                </section>
                Compose
            </button>

            <nav className="side-bar-navs">
                <NavLink className="side-bar-single-nav" to="/mail/inbox">
                    <section className="side-bar-icon">
                        <BiSolidInbox/>
                    </section>
                    Inbox
                    <section className="side-bar-single-nav-number">
                        {unreadCount}
                    </section>
                    
                </NavLink>
                
                <NavLink className="side-bar-single-nav" to="/mail/starred">
                    <section className="side-bar-icon">
                            <MdStarBorder/>
                    </section>
                    Starred
                </NavLink>
                
                <NavLink className="side-bar-single-nav" to="/mail/sent">
                    <section className="side-bar-icon">
                        <MdOutlineSend/>
                    </section>
                    Sent
                </NavLink>
                
                <NavLink className="side-bar-single-nav" to="/mail/trash">
                    <section className="side-bar-icon">
                        <LuTrash2/>
                    </section>
                    Trash
                </NavLink>
                
                <NavLink className="side-bar-single-nav" to="/mail/drafts">
                    <section className="side-bar-icon">
                        <RiDraftLine/>
                    </section>
                    Drafts
                </NavLink>
                
            </nav>
        </div>
        
    )
}