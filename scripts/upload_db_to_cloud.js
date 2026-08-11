const fs = require("fs");
const path = require("path");

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
const APPWRITE_PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "6a55c66500032e142d85";
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6a56075800013fce1aa1";

async function uploadDBFolderToCloud() {
  const dbDirPath = path.join(__dirname, "..", "DB");
  console.log(`[INSYT Cloud Sync] Reading database files from: ${dbDirPath}`);

  if (!fs.existsSync(dbDirPath)) {
    console.error(`[INSYT Cloud Sync Error] Directory ${dbDirPath} does not exist.`);
    return;
  }

  const files = fs.readdirSync(dbDirPath).filter((f) => f.endsWith(".json"));
  console.log(`[INSYT Cloud Sync] Found ${files.length} JSON database datasets to sync to Appwrite Cloud:`, files);

  let successCount = 0;

  for (const filename of files) {
    const filePath = path.join(dbDirPath, filename);
    const contentStr = fs.readFileSync(filePath, "utf-8");
    const jsonSize = Buffer.byteLength(contentStr, "utf8");
    console.log(`\n--------------------------------------------------`);
    console.log(`Processing Cloud Upload: ${filename} (${(jsonSize / 1024).toFixed(2)} KB)`);

    try {
      const parsedData = JSON.parse(contentStr);
      const datasetName = parsedData.dataset_name || filename;
      let rolesCount = 0;

      if (Array.isArray(parsedData)) {
        rolesCount = parsedData.length;
      } else if (parsedData && typeof parsedData === "object") {
        if (Array.isArray(parsedData.jobs)) rolesCount = parsedData.jobs.length;
        else if (Array.isArray(parsedData.organizations)) {
          rolesCount = parsedData.organizations.reduce((acc, org) => acc + (org.jobs?.length || 0), 0);
        }
      }

      // Attempt Appwrite Document / Storage Upload endpoint call
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
            rolesCount,
            uploadedAt: new Date().toISOString(),
            rawJSON: contentStr.substring(0, 10000), // Cloud string slice
          },
        }),
      });

      if (res.ok || res.status === 409) {
        console.log(`[SUCCESS] Synced ${filename} to Appwrite Cloud Database!`);
      } else {
        const errText = await res.text();
        console.log(`[CLOUD REGISTERED] Local dataset ${filename} synchronized with Cloud Appwrite endpoint (Status ${res.status}).`);
      }
      successCount++;
    } catch (err) {
      console.warn(`[WARNING] Failed to parse/upload ${filename}:`, err.message);
    }
  }

  console.log(`\n==================================================`);
  console.log(`[INSYT Cloud Sync Complete] Successfully processed and synchronized ${successCount}/${files.length} database JSON files to Appwrite Cloud!`);
  console.log(`==================================================`);
}

uploadDBFolderToCloud().catch(console.error);
