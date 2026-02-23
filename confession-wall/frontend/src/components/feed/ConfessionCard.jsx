import { FaHeart, FaComment } from "react-icons/fa";

const ConfessionCard = ({ confession }) => {
  const totalReactions =
    (confession.reactions?.like || 0) +
    (confession.reactions?.support || 0) +
    (confession.reactions?.love || 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
      <p className="text-gray-800 mb-6">
        {confession.text}
      </p>

      <div className="flex justify-between items-center text-gray-500 text-sm">
        <span>shadow</span>

        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1">
            <FaHeart />
            {totalReactions}
          </span>

          <span className="flex items-center gap-1">
            <FaComment />
            0
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConfessionCard;
