import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import "./CSS/Connections.css";
import { fetchConnections } from "./api"; // Adjust the import path as necessary

const Connections = ({ reloadConnections }) => {
  const { user } = useContext(UserContext);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserConnections = async () => {
      try {
        if (user) {
          const connectionsList = await fetchConnections(user.uid);
          setConnections(connectionsList);
        }
      } catch (error) {
        console.error("Error fetching connections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserConnections();
  }, [user, reloadConnections]);

  return (
    <div className="connections card">
      <h4>Connections</h4>
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        connections.length > 0 ? (
          <ul>
            {connections.map((connection) => (
              <li key={connection.uid}>
                {connection.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No connections.</p>
        )
      )}
    </div>
  );
};

export default Connections;
