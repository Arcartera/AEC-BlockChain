import { useState, useEffect } from "react";
import "./message.scss";

function Message({ msg }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [msg]);

  return (
    <div key={msg} className={`fade-away ${show ? "show" : "hide"}`}>
      {msg}
    </div>
  );
}

export default Message;
