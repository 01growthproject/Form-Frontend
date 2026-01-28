import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar.jsx";
import ClientFilter from "./ClientFilter.jsx";
import ClientTable from "./ClientTable.jsx";
import "./Admin.css";

const VITE_API_URL_FORM = import.meta.env.VITE_API_URL_FORM;

const Admin = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(VITE_API_URL_FORM);

      if (res.data.success) {
        setClients(res.data.data || []);
      } else {
        setClients(res.data || []);
      }
    } catch (err) {
      console.error(err);
      setError("❌ Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) => {
    const name = client.clientName?.toLowerCase() || "";
    const phone = client.phone || "";
    const country = client.country?.toLowerCase() || "";
    const email = client.email?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    return (
      name.includes(search) ||
      phone.includes(search) ||
      country.includes(search) ||
      email.includes(search)
    );
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewClient = (client) => {
    navigate(`/admin/client/${client._id}`, { state: { client } });
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await axios.delete(`${VITE_API_URL_FORM}/${clientId}`);
        setClients(clients.filter((c) => c._id !== clientId));
        alert("✅ Client deleted successfully");
      } catch (err) {
        alert("❌ Failed to delete client: " + err.message);
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className="admin-wrapper">
        <div className="admin-container">
          <div className="admin-header">
            <h2>👥 All Clients</h2>
            <p>View all submitted forms</p>
          </div>

          <ClientFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            totalClients={clients.length}
            onRefresh={fetchClients}
            loading={loading}
          />

          {/* ✅ Loading */}
          {loading && (
            <div className="no-results">
              <p>⏳ Loading clients...</p>
            </div>
          )}

          {/* ✅ Error */}
          {error && (
            <div className="no-results">
              <p>{error}</p>
            </div>
          )}

          {/* ✅ Table */}
          {!loading && !error && (
            <ClientTable
              clients={filteredClients}
              onEdit={handleViewClient}
              onDelete={handleDeleteClient}
              formatDate={formatDate}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Admin;