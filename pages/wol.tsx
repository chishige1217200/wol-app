import { useEffect, useState } from "react";
import { Oxanium } from "next/font/google";
import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { pcDataType } from "./api/types/pcDataType";

const oxanium = Oxanium({
  variable: "--font-oxanium",
  subsets: ["latin"],
});

export default function Wol() {
  const [pcs, setPcs] = useState<pcDataType[]>([]);
  const [selectedMac, setSelectedMac] = useState("");
  const [status, setStatus] = useState("操作待機中...");

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
    setStatus("WOLパケット送信中...");
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
    <div style={{ fontFamily: "sans-serif", padding: "20px", textAlign: "center" }}>
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={2}
        repeatDelay={1}
        className={cn(
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
      />
      <h1 className={oxanium.className} style={{fontSize: "40px"}}>Wake On LAN</h1>
      <select name="pulldown" value={selectedMac} onChange={e => setSelectedMac(e.target.value)}>
        {pcs.map(pc => (
          <option key={pc.mac} value={pc.mac}>
            {pc.name} ({pc.mac})
          </option>
        ))}
      </select>
      <div className="flex justify-center mt-5 mb-5">
        <ShimmerButton className={`shadow-2xl ${oxanium.className}`} onClick={wakePC}>
          <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
            ACTIVATE
          </span>
        </ShimmerButton>
      </div>

      <p className="min-h-6">{status}</p>
    </div>
  );
}
