import { useState } from "react";
import axios from "axios";

const WriteSecretModal = ({ onClose, onSuccess }) => {
  const [text, setText] = useState("");
  const [secret, setSecret] = useState("Secret");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;

    setLoading(true);

    try {
      await axios.post("http://localhost:3000/confessions", {
        text,
        secret,
        reactions: {
          like: 0,
          support: 0,
          love: 0
        },
        userId: "anonymous"
      });

      setText("");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error posting confession", err);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg p-8 rounded-3xl shadow-lg relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">
          Share a Secret
        </h2>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="I'm feeling..."
          className="w-full h-32 p-4 rounded-xl bg-gray-100 outline-none mb-6"
        />

        <div className="flex gap-3 mb-6">
          {["Crush", "Study", "Funny", "Secret"].map((vibe) => (
            <button
              key={vibe}
              onClick={() => setSecret(vibe)}
              className={`px-4 py-2 rounded-full text-sm
                ${secret === vibe
                  ? "bg-blue-400 text-white"
                  : "bg-gray-200"
                }`}
            >
              {vibe}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-400 text-white py-3 rounded-full hover:bg-blue-500 transition"
        >
          {loading ? "Posting..." : "Post Secret"}
        </button>

      </div>
    </div>
  );
};

export default WriteSecretModal;
