import "./Admin.css";

const ClientTable = ({ clients, onEdit, onDelete, formatDate }) => {
  return (
    <div className="users-table-wrapper">
      <table className="users-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Client Name</th>
            <th>Surname</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Nationality</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Marital Status</th>
            <th>Submitted</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {clients.map((client, index) => (
            <tr key={client._id}>
              <td>{index + 1}</td>
              <td>{client.clientName || "N/A"}</td>
              <td>{client.surname || "N/A"}</td>
              <td>{client.contact || "N/A"}</td>
              <td>{client.email || "N/A"}</td>
              <td>{client.nationality || "N/A"}</td>
              <td>{client.gender || "N/A"}</td>
              <td>{client.age || "N/A"}</td>
              <td>{client.maritalStatus || "N/A"}</td>
              <td>{formatDate(client.createdAt)}</td>
              
              <td>
                <div className="action-btns">
                  <button
                    className="btn btn-edit"
                    onClick={() => onEdit(client)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => onDelete(client._id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {clients.length === 0 && (
        <div className="no-results">
          <p>No clients found</p>
        </div>
      )}
    </div>
  );
};

export default ClientTable;