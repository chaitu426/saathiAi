// ProgressDisplay.jsx
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5001", { transports: ["websocket"] }); // initialize once

export default function ProgressDisplay({ jobId }) {
  const [status, setStatus] = useState("");

  useEffect(() => {
    socket.on(`job-progress-${jobId}`, (data) => {
      setStatus(data.message);
    });

    return () => {
      socket.off(`job-progress-${jobId}`); // remove listener, not disconnect socket
    };
  }, [jobId]);

  return (
    <div className="p-1 bg-neutral-900 text-white rounded-lg">
      <p>{status}</p>
    </div>
  );
}
