import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
const APPWRITE_PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "6a55c66500032e142d85";
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6a56075800013fce1aa1";

async function processSync(fileFilter?: string | null) {
  const dbDirPath = path.join(process.cwd(), "DB");
  if (!fs.existsSync(dbDirPath)) {
    throw new Error("DB directory not found at " + dbDirPath);
  }

  let files = fs.readdirSync(dbDirPath).filter((f) => f.endsWith(".json"));

  if (fileFilter) {
    files = files.filter((f) => f.toLowerCase() === fileFilter.toLowerCase());
  }

  const results: any[] = [];
  let totalRolesCount = 0;

  for (const filename of files) {
    const filePath = path.join(dbDirPath, filename);
    const contentStr = fs.readFileSync(filePath, "utf-8");
    const fileSizeKb = (Buffer.byteLength(contentStr, "utf-8") / 1024).toFixed(1);

    try {
      const parsed = JSON.parse(contentStr);
      let datasetName = filename;
      let rolesCount = 0;

      if (Array.isArray(parsed)) {
        rolesCount = parsed.length;
        datasetName = parsed[0]?.dataset_name || filename;
      } else if (parsed && typeof parsed === "object") {
        datasetName = parsed.dataset_name || filename;
        if (Array.isArray(parsed.jobs)) rolesCount = parsed.jobs.length;
        else if (Array.isArray(parsed.organizations)) {
          rolesCount = parsed.organizations.reduce((acc: number, org: any) => acc + (org.jobs?.length || 0), 0);
        }
      }

      totalRolesCount += rolesCount;

      // Register dataset with Appwrite Cloud Database Endpoint
      const documentId = `db_${filename.replace(/[^a-z0-9]/gi, "_")}`;
      let cloudStatus = "registered";

      try {
        const res = await fetch(`${APPWRITE_ENDPOINT}/databases/${APPWRITE_DATABASE_ID}/collections/jobs/documents`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Appwrite-Project": APPWRITE_PROJECT,
          },
          body: JSON.stringify({
            documentId,
            data: {
              filename,
              datasetName,
              uploadedAt: new Date().toISOString(),
              rolesCount,
              fileSizeKb,
            },
          }),
        });
        cloudStatus = res.ok ? "uploaded" : res.status === 409 ? "exists" : `registered_code_${res.status}`;
      } catch (cloudErr: any) {
        cloudStatus = "synced_locally";
      }

      results.push({
        filename,
        datasetName,
        rolesCount,
        fileSizeKb: `${fileSizeKb} KB`,
        cloudStatus,
        syncedAt: new Date().toISOString(),
      });
    } catch (jsonErr: any) {
      results.push({ filename, error: jsonErr.message, fileSizeKb: `${fileSizeKb} KB` });
    }
  }

  return {
    success: true,
    syncTimestamp: new Date().toISOString(),
    totalFiles: results.length,
    totalRolesCount,
    datasets: results,
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const file = searchParams.get("file");
    const data = await processSync(file);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    let file: string | null = null;
    try {
      const body = await req.json();
      file = body.file || null;
    } catch {
      /* ignore empty body */
    }
    const data = await processSync(file);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
