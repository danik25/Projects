import { NavLink } from "react-router-dom"

export function SideBar() {
    return (
        <div className="side-bar-container">
            <nav>
                <NavLink to="/email">Inbox</NavLink>
                {/* <NavLink>Starred</NavLink>
                <NavLink>Sent</NavLink> */}
            </nav>
        </div>
        
    )
}