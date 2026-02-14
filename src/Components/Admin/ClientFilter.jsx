import "./Admin.css";

const ClientFilter = ({ searchTerm, onSearchChange, totalClients, onRefresh, loading }) => {
  return (
    <div className="admin-toolbar">
      <input
        type="text"
        placeholder="Search by name, contact, email, or nationality"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />

      <span className="stat-badge">Total: {totalClients}</span>

      <button
        onClick={onRefresh}
        className="btn-action secondary"
        style={{ marginLeft: "auto" }}
        disabled={loading}
      >
        Refresh
      </button>
    </div>
  );
};

export default ClientFilter;