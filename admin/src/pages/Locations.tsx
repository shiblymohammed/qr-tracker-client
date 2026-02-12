import { useEffect, useState } from "react";
import { getLocations, createLocation } from "../services/api";
import MainLayout from "../components/layout/MainLayout";

type Location = {
  id: number;
  name: string;
  code: string;
};

const BASE_URL = "http://127.0.0.1:8000";

export default function Locations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const loadLocations = async () => {
    const res = await getLocations();
    setLocations(res.data);
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const handleCreate = async () => {
    await createLocation({ name, code });
    setName("");
    setCode("");
    loadLocations();
  };

  return (
    <MainLayout>
      <h2>Locations</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Location name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Unique code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button onClick={handleCreate}>Create</button>
      </div>

      <h3>Generated Links</h3>
      <ul>
        {locations.map((loc) => (
          <li key={loc.id}>
            <strong>{loc.name}</strong>
            <br />
            {BASE_URL}/q/{loc.code}
          </li>
        ))}
      </ul>
    </MainLayout>
  );
}
