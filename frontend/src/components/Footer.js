import { useEffect, useState } from "react";

export default function Footer() {
  const [time, setTime] = useState(new Date().toLocaleString("fr-FR"));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleString("fr-FR"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer style={{ marginTop: 20 }}>
      TO.SystemAdministration: ITAM Enterprise v4 • VM 192.168.56.110 • {time}
      <br />
      Djezzy
    </footer>
  );
}

