import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { pcDataType } from "./types/pcDataType";
import { errorType } from "./types/errorType";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<pcDataType[] | errorType>,
) {
  const pcsFile = path.join(process.cwd(), "pcs.json");
  try {
    const data = fs.readFileSync(pcsFile, "utf-8");
    const pcs = JSON.parse(data);
    res.status(200).json(pcs);
  } catch (err) {
    console.error("PCリスト読み込み失敗:", err);
    res.status(500).json({ error: "PCリスト読み込みに失敗しました" });
  }
}
