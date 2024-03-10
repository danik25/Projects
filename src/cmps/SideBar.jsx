import { NavLink } from "react-router-dom"

import { Outlet, useSearchParams } from "react-router-dom";

export function SideBar({unreadCount}) {
    // Search params, for 'compose'
    const [setSearchParams] = useSearchParams() 
    
    function handleClick() {
        setSearchParams({compose:'new'})
    }
    return (
        <div className="side-bar-container">
            <button className="side-bar-compose" onClick={()=>handleClick()}>Compose</button>
            <nav className="side-bar-navs">
                <section className="side-bar-inbox">
                    <NavLink to="/mail/inbox">Inbox
                    </NavLink>
                    {unreadCount}
                </section>
                
                <NavLink to="/mail/starred">Starred</NavLink>
                <NavLink to="/mail/sent">Sent</NavLink>
                <NavLink to="/mail/trash">Trash</NavLink>
                <NavLink to="/mail/drafts">Drafts</NavLink>
            </nav>
            <Outlet/>
        </div>
        
    )
}