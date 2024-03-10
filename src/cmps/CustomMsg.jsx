import { useEffect, useState } from "react"
import {eventBusService} from '../services/event-bus.service'
export function CustomMsg() {
    const [msg, setMsg] = useState(null)
    
    useEffect(() => {
        eventBusService.on('custom-msg', (msg) => {
            setMsg(msg)
            setTimeout(onCloseMsg, 3000)
        })
    }, [])

    function onCloseMsg() {
        setMsg(null)
    }

    if (!msg) return <></>
    return (
        <div className={"custom-msg-container " + msg.type}>
            <section>{msg.txt}</section>
            <button className="custom-msg-btn" onClick={onCloseMsg}>X</button>
        </div>
    )
}