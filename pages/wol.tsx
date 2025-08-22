import { useEffect, useState } from "react";
import { pcDataType } from "./type/pcDataType";

export default function Wol() {
  const [pcs, setPcs] = useState<pcDataType[]>([]);
  const [selectedMac, setSelectedMac] = useState("");
  const [status, setStatus] = useState("");

  // 初回ロード時にPC一覧を取得
  useEffect(() => {
    fetch("/api/pcs")
      .then(res => res.json())
      .then(data => {
        setPcs(data);
        if (data.length > 0) {
          setSelectedMac(data[0].mac);
        }
      });
  }, []);

  // WOL実行
  const wakePC = async () => {
    setStatus("起動コマンド送信中...");
    const res = await fetch("/api/wake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mac: selectedMac })
    });
    const data = await res.json();
    if (res.ok) {
      setStatus(data.message);
    } else {
      setStatus("エラー: " + data.error);
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <h1>Wake On LAN</h1>
      <select value={selectedMac} onChange={e => setSelectedMac(e.target.value)}>
        {pcs.map(pc => (
          <option key={pc.mac} value={pc.mac} style={{ backgroundColor: "#000000" }}>
            {pc.name} ({pc.mac})
          </option>
        ))}
      </select>
      <button onClick={wakePC} style={{ marginLeft: "10px" }}>起動</button>
      <p>{status}</p>
    </div>
  );
}
