import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  const handleSignIn = async () => {
    try {
      const res = await fetch("http://localhost:3001/auth/sign-in", {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();
      setMessage(data.message || "Signed in successfully!");
    } catch (err) {
      console.log(err);
      if (err instanceof Error) {
        setMessage("Error signing in: " + err.message);
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
        background: "blue",
      }}>
      <button onClick={handleSignIn}>Sign In</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
