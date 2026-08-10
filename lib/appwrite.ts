import { Client, Account, Databases, OAuthProvider } from "appwrite";
import { APPWRITE_CONFIG } from "@/lib/config";

const client = new Client()
    .setEndpoint(APPWRITE_CONFIG.endpoint)
    .setProject(APPWRITE_CONFIG.projectId);

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases, OAuthProvider };
