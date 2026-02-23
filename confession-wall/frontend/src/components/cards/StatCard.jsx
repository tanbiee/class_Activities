const StatCard = ({ title, value, borderColor, clickable }) => {
  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-sm border-t-4 ${borderColor}
      ${clickable ? "cursor-pointer hover:shadow-md transition" : ""}`}
    >
      <p className="text-gray-900 text-sm mb-2">{title}</p>
      <h2 className="text-3xl font-semibold">{value}</h2>
    </div>
  );
};

export default StatCard;
