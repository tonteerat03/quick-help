import React, { useEffect } from "react";

const ChatBot = () => {
  useEffect(() => {
    // Create a stub until Chatbase initializes
    try {
      if (!window.chatbase || window.chatbase("getState") !== "initialized") {
        const stub = (...args) => {
          if (!window.chatbase.q) window.chatbase.q = [];
          window.chatbase.q.push(args);
        };
        window.chatbase = new Proxy(stub, {
          get(target, prop) {
            if (prop === "q") return target.q;
            return (...args) => target(prop, ...args);
          },
        });
      }
    } catch (e) {
      // no-op
    }

    const onLoad = () => {
      // Avoid duplicate script injection
      if (document.getElementById("6pFziuVzoOhIyeJO1G9qg")) return;
      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = "6pFziuVzoOhIyeJO1G9qg"; // chatbot id per Chatbase embed
      script.defer = true;
      script.async = true;
      script.setAttribute("domain", "www.chatbase.co");
      document.body.appendChild(script);
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }

    return () => {
      window.removeEventListener("load", onLoad);
      // keep the script for the lifetime of the app; don't remove on unmount
    };
  }, []);

  // Floating widget renders itself; no visible JSX needed
  return null;
};

export default ChatBot;
