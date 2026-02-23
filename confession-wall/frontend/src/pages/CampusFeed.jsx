import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/layout/DashboardLayout";
import ConfessionCard from "../components/feed/ConfessionCard";
import WriteSecretModal from "../components/feed/WriteSecretModal";

const CampusFeed = () => {
  const [confessions, setConfessions] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchConfessions = async () => {
    try {
      const res = await axios.get("http://localhost:3000/confessions");
      setConfessions(res.data.message.reverse());
    } catch (err) {
      console.error("Error fetching confessions", err);
    }
  };

  useEffect(() => {
    fetchConfessions();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          # Trending on Campus
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-400 text-white px-5 py-2 rounded-full hover:bg-blue-500 transition"
        >
          Write Secret
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {confessions.map((confession) => (
          <ConfessionCard
            key={confession._id}
            confession={confession}
          />
        ))}
      </div>

      {showModal && (
        <WriteSecretModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchConfessions}
        />
      )}
    </DashboardLayout>
  );
};

export default CampusFeed;
