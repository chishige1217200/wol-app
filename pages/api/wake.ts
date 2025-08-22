import { NextApiRequest, NextApiResponse } from "next";
import wol from "wake_on_lan";
import fs from "fs";
import path from "path";
import { pcDataType } from "../type/pcDataType";
import { messageType } from "../type/messageType";
import { errorType } from "../type/errorType";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<messageType | errorType>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POSTメソッドのみ対応しています" });
  }

  const { mac } = req.body;
  const pcsFile = path.join(process.cwd(), "pcs.json");

  try {
    const pcs: pcDataType[] = JSON.parse(fs.readFileSync(pcsFile, "utf-8"));
    const target = pcs.find(pc => pc.mac === mac);

    if (!target) {
      return res.status(400).json({ error: "指定されたPCが見つかりません" });
    }

    wol.wake(target.mac, (error) => {
      if (error) {
        console.error("WOLエラー:", error);
        return res.status(500).json({ error: "WOL失敗: " + error });
      }
      console.log(`WOL送信完了: ${target.name} (${target.mac})`);
      res.status(200).json({ message: `WOLパケットを送信しました: ${target.name}` });
    });
  } catch (err) {
    console.error("WOL処理失敗:", err);
    res.status(500).json({ error: "サーバエラー" });
  }
}
