import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const DocumentDetails = () => {
  const socket = io("http://localhost:5000");

  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.token) {
          console.error("No user or token found in localStorage");
          navigate("/");
          return;
        }

        const token = user.token;
        const { data } = await axios.get(
          `http://localhost:5000/api/documents/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDocument(data);
        setTitle(data.title);
        setContent(data.content);
      } catch (error) {
        setError("Failed to fetch document");
      }
    };
    fetchDocument();
  }, [id, navigate]);

  useEffect(() => {
    socket.on("documentUpdated", (updatedDocument) => {
      if (updatedDocument._id === id) {
        setDocument(updatedDocument);
        setTitle(updatedDocument.title);
        setContent(updatedDocument.content);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [id, socket]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.token) {
        console.error("No user or token found in localStorage");
        navigate("/");
        return;
      }

      const token = user.token;
      const { data } = await axios.put(
        `http://localhost:5000/api/documents/${id}`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDocument(data);
      setSuccessMessage("Document updated successfully");
      socket.emit("updateDocument", data);
    } catch (error) {
      setError("Failed to update document");
    }
  };

  const handleDelete = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.token) {
        console.error("No user or token found in localStorage");
        navigate("/");
        return;
      }

      const token = user.token;
      await axios.delete(`http://localhost:5000/api/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/dashboard");
    } catch (error) {
      setError("Failed to delete document");
    }
  };

  return (
    <div>
      <h1>Document Details</h1>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      {document ? (
        <form onSubmit={handleUpdate}>
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Content:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <button type="submit">Update Document</button>
          <button type="button" onClick={handleDelete}>
            Delete Document
          </button>
        </form>
      ) : (
        <p>Loading document...</p>
      )}
    </div>
  );
};

export default DocumentDetails;
