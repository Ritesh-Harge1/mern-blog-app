import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PostList from "./components/PostList";
import { useState } from "react";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <div style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
        {!token && <Link to="/signup" style={{ marginRight: "10px" }}>Signup</Link>}
        {!token && <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>}
        {token && <button onClick={handleLogout}>Logout</button>}
      </div>

      <Routes>
        <Route path="/" element={<PostList token={token} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
      </Routes>
    </Router>
  );
}

export default App;
