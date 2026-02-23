import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import PostConfessionModal from "../modals/PostConfessionModal";

const DashboardLayout = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f0f1a" }}>
      <Sidebar onWriteClick={() => setIsModalOpen(true)} />

      {/* Main content — pushed right by sidebar width */}
      <div style={{ marginLeft: 250, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Topbar />
        <main style={{ flex: 1, padding: "32px 40px", maxWidth: 1200, width: "100%", margin: "0 auto" }}>
          {children}
        </main>
      </div>

      <PostConfessionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default DashboardLayout;
