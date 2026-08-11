import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
const APPWRITE_PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "6a55c66500032e142d85";
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6a56075800013fce1aa1";

export async function GET() {
  try {
    const dbDirPath = path.join(process.cwd(), "DB");
    if (!fs.existsSync(dbDirPath)) {
      return NextResponse.json({ error: "DB directory not found" }, { status: 404 });
    }

    const files = fs.readdirSync(dbDirPath).filter((f) => f.endsWith(".json"));
    const results: any[] = [];

    for (const filename of files) {
      const filePath = path.join(dbDirPath, filename);
      const contentStr = fs.readFileSync(filePath, "utf-8");

      try {
        const parsed = JSON.parse(contentStr);
        const datasetName = parsed.dataset_name || (Array.isArray(parsed) ? parsed[0]?.dataset_name : filename);

        const res = await fetch(`${APPWRITE_ENDPOINT}/databases/${APPWRITE_DATABASE_ID}/collections/jobs/documents`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Appwrite-Project": APPWRITE_PROJECT,
          },
          body: JSON.stringify({
            documentId: `db_${filename.replace(/[^a-z0-9]/gi, "_")}`,
            data: {
              filename,
              datasetName,
              uploadedAt: new Date().toISOString(),
              rawJSON: contentStr.substring(0, 10000),
            },
          }),
        });

        results.push({ filename, datasetName, status: res.status });
      } catch (jsonErr: any) {
        results.push({ filename, error: jsonErr.message });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synchronized ${results.length} database JSON files with Appwrite Cloud`,
      datasets: results,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
