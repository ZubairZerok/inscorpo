"use client";

import { Client, Account, Databases, ID, Query } from "appwrite";
import { UserState } from "./state/types";
import { APPWRITE_CONFIG } from "@/lib/config";

export const client = new Client();

client
  .setEndpoint(APPWRITE_CONFIG.endpoint)
  .setProject(APPWRITE_CONFIG.projectId);

export const account = new Account(client);
export const databases = new Databases(client);

export const DB_CONFIG = {
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6a56075800013fce1aa1",
  collections: {
    users: "users",
    tasks: "tasks",
    events: "events",
    communityPosts: "community_posts",
    communityReplies: "community_replies",
    mockTests: "mock_tests",
    workshops: "workshops",
    certificates: "certificates",
    workshopRegistrations: "workshop_registrations",
    testAttempts: "test_attempts",
    paths: "paths",
    courses: "courses",
    profiles: "profiles",
    jobApplications: "job_applications",
  },
};

// ─── Users Collection ────────────────────────────────────────────────────────

export interface UserDoc {
  $id?: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  streak: number;
  lastCheckInDate?: string;
  passportProfile?: string;
  subscriptionTier?: string;
}

export async function fetchUserFromDB(userId: string): Promise<UserDoc | null> {
  try {
    const doc = await databases.getDocument(
      DB_CONFIG.databaseId,
      DB_CONFIG.collections.users,
      userId
    );
    return doc as unknown as UserDoc;
  } catch (err) {
    console.warn("[Appwrite DB Sync Warning]: Could not fetch user document", err);
    return null;
  }
}

export async function createUserInDB(userId: string, name: string, email: string): Promise<UserDoc | null> {
  try {
    const doc = await databases.createDocument(
      DB_CONFIG.databaseId,
      DB_CONFIG.collections.users,
      userId,
      {
        name,
        email,
        xp: 0,
        level: 1,
        streak: 1,
        lastCheckInDate: new Date().toISOString().split("T")[0],
        subscriptionTier: "starter",
      }
    );
    return doc as unknown as UserDoc;
  } catch (err) {
    console.warn("[Appwrite DB Sync Warning]: Could not create user document", err);
    return null;
  }
}

export async function updateUserStateInDB(userId: string, partial: Partial<UserState>): Promise<boolean> {
  try {
    const updateData: Record<string, any> = {};
    if (partial.xp !== undefined) updateData.xp = partial.xp;
    if (partial.level !== undefined) updateData.level = partial.level;
    if (partial.streak !== undefined) updateData.streak = partial.streak;
    if (partial.lastCheckInDate !== undefined) updateData.lastCheckInDate = partial.lastCheckInDate;
    if (partial.passportProfile !== undefined) updateData.passportProfile = JSON.stringify(partial.passportProfile);
    if (partial.subscriptionTier !== undefined) updateData.subscriptionTier = partial.subscriptionTier;

    if (Object.keys(updateData).length === 0) return true;

    await databases.updateDocument(
      DB_CONFIG.databaseId,
      DB_CONFIG.collections.users,
      userId,
      updateData
    );
    return true;
  } catch (err) {
    console.warn("[Appwrite DB Sync Warning]: Could not update user document", err);
    return false;
  }
}

export const syncUserProfile = updateUserStateInDB;

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export async function fetchLeaderboardFromDB(): Promise<any[]> {
  try {
    const response = await databases.listDocuments(
      DB_CONFIG.databaseId,
      DB_CONFIG.collections.users,
      [Query.limit(50), Query.orderDesc("xp")]
    );
    if (response.documents && response.documents.length > 0) {
      return response.documents
        .map((doc: any) => ({
          id: doc.$id,
          name: doc.name || "Executive Candidate",
          xp: typeof doc.xp === "number" ? doc.xp : 0,
          level: typeof doc.level === "number" ? doc.level : 1,
          streak: typeof doc.streak === "number" ? doc.streak : 0,
          isUser: false,
        }))
        .sort((a, b) => b.xp - a.xp);
    }
  } catch (err) {
    console.warn("[Appwrite DB Leaderboard Warning]:", err);
  }

  return [];
}

export const fetchLeaderboard = fetchLeaderboardFromDB;

// ─── Community Posts ──────────────────────────────────────────────────────────

export const INITIAL_COMMUNITY_POSTS = [
  {
    id: "seed_1",
    author: { name: "Farhan Ahmed", role: "GMAT 720 Scorer", avatar: "FA" },
    content: "Just scored 720 on GMAT after 3 months on INSYT! The Data Insights module was 🔥. The practice questions are almost identical to the real exam. Huge thanks to the community!",
    space: "GMAT",
    time: "2 hours ago",
    likes: 47,
    comments: 2,
    isLikedByMe: false,
    replies: [
      { author: "Nusrat Jahan", text: "Congrats Farhan! How many hours did you study daily?" },
      { author: "Farhan Ahmed", text: "Thanks Nusrat! About 2-3 hours daily after work using the INSYT study plan." },
    ],
  },
];

function normalizePost(doc: any): any {
  if (!doc) return null;

  const authorName = doc.author?.name || doc.authorName || "Anonymous Learner";
  const authorRole = doc.author?.role || doc.authorRole || "Student";
  const avatar = doc.author?.avatar || (authorName.substring(0, 2).toUpperCase() || "AL");

  let parsedReplies: any[] = [];
  if (Array.isArray(doc.replies)) {
    parsedReplies = doc.replies.map((r: any) => (typeof r === "string" ? JSON.parse(r) : r));
  } else if (typeof doc.replies === "string") {
    try {
      parsedReplies = JSON.parse(doc.replies);
    } catch {
      parsedReplies = [];
    }
  }

  let timeFormatted = doc.time;
  if (!timeFormatted && doc.$createdAt) {
    try {
      const now = new Date();
      const created = new Date(doc.$createdAt);
      const diffHrs = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
      timeFormatted = diffHrs < 1 ? "Just now" : `${diffHrs}h ago`;
    } catch {
      timeFormatted = "Recently";
    }
  }

  return {
    id: doc.$id || doc.id || `post_${Date.now()}`,
    author: {
      name: authorName,
      role: authorRole,
      avatar,
    },
    content: doc.content || "",
    space: doc.space || "General",
    time: timeFormatted || "Recently",
    likes: typeof doc.likes === "number" ? doc.likes : 0,
    comments: typeof doc.comments === "number" ? doc.comments : parsedReplies.length,
    isLikedByMe: false,
    replies: parsedReplies,
  };
}

export async function fetchCommunityPosts(): Promise<any[]> {
  try {
    const response = await databases.listDocuments(
      DB_CONFIG.databaseId,
      DB_CONFIG.collections.communityPosts,
      [Query.limit(30), Query.orderDesc("$createdAt")]
    );
    if (response.documents && response.documents.length > 0) {
      return response.documents.map(normalizePost);
    }
  } catch (err) {
    console.warn("[Appwrite DB Community Warning]:", err);
  }
  return INITIAL_COMMUNITY_POSTS;
}

export async function createCommunityPost(data: {
  authorName: string;
  authorRole: string;
  content: string;
  space: string;
}): Promise<any> {
  try {
    const doc = await databases.createDocument(
      DB_CONFIG.databaseId,
      DB_CONFIG.collections.communityPosts,
      ID.unique(),
      {
        authorName: data.authorName,
        authorRole: data.authorRole,
        content: data.content,
        space: data.space,
        likes: 0,
        replies: [],
      }
    );
    return normalizePost(doc);
  } catch (err) {
    console.warn("[Appwrite DB Community Create Error]:", err);
    return null;
  }
}

export async function likeCommunityPost(postId: string): Promise<boolean> {
  try {
    const doc = await databases.getDocument(
      DB_CONFIG.databaseId,
      DB_CONFIG.collections.communityPosts,
      postId
    );
    const currentLikes = typeof (doc as any).likes === "number" ? (doc as any).likes : 0;
    await databases.updateDocument(
      DB_CONFIG.databaseId,
      DB_CONFIG.collections.communityPosts,
      postId,
      { likes: currentLikes + 1 }
    );
    return true;
  } catch {
    return false;
  }
}

export async function addReplyToPost(postId: string, replyData: { author: string; text: string }): Promise<void> {
  try {
    await databases.createDocument(
      DB_CONFIG.databaseId,
      DB_CONFIG.collections.communityReplies,
      ID.unique(),
      { ...replyData, parentId: postId }
    );
  } catch {
    /* silent fallback */
  }
}

// ─── Tasks & Events ───────────────────────────────────────────────────────────

export async function fetchTasks(): Promise<any[]> {
  try {
    const response = await databases.listDocuments(
      DB_CONFIG.databaseId,
      DB_CONFIG.collections.tasks,
      [Query.limit(20)]
    );
    return response.documents;
  } catch {
    return [];
  }
}

export async function createTask(data: any): Promise<any> {
  try {
    return await databases.createDocument(
      DB_CONFIG.databaseId,
      DB_CONFIG.collections.tasks,
      ID.unique(),
      data
    );
  } catch {
    return null;
  }
}

export async function fetchEvents(): Promise<any[]> {
  try {
    const response = await databases.listDocuments(
      DB_CONFIG.databaseId,
      DB_CONFIG.collections.events,
      [Query.limit(20)]
    );
    return response.documents;
  } catch {
    return [];
  }
}

export async function createEvent(data: any): Promise<any> {
  try {
    return await databases.createDocument(
      DB_CONFIG.databaseId,
      DB_CONFIG.collections.events,
      ID.unique(),
      data
    );
  } catch {
    return null;
  }
}

// ─── Mock Tests & Workshops ───────────────────────────────────────────────────

export async function fetchMockTests(): Promise<any[]> {
  try {
    const response = await databases.listDocuments(
      DB_CONFIG.databaseId,
      DB_CONFIG.collections.mockTests,
      [Query.limit(20)]
    );
    return response.documents;
  } catch {
    return [];
  }
}

export async function fetchWorkshops(): Promise<any[]> {
  try {
    const response = await databases.listDocuments(
      DB_CONFIG.databaseId,
      DB_CONFIG.collections.workshops,
      [Query.limit(20)]
    );
    return response.documents;
  } catch {
    return [];
  }
}

export async function bookWorkshopSeat(workshopId: string, userId: string, extraData?: any): Promise<boolean> {
  try {
    const payload: any = { workshopId, userId, bookedAt: new Date().toISOString() };
    if (extraData && typeof extraData === "object") {
      if (extraData.fullName) payload.fullName = extraData.fullName;
      if (extraData.email) payload.email = extraData.email;
      if (extraData.phone) payload.phone = extraData.phone;
      if (extraData.institution) payload.institution = extraData.institution;
      if (extraData.department) payload.department = extraData.department;
      if (extraData.reason) payload.reason = extraData.reason;
      if (extraData.ticketCode) payload.ticketCode = extraData.ticketCode;
    }
    try {
      await databases.createDocument(
        DB_CONFIG.databaseId,
        DB_CONFIG.collections.workshopRegistrations,
        ID.unique(),
        payload
      );
      return true;
    } catch {
      // Fallback if Appwrite collection schema lacks custom attributes
      await databases.createDocument(
        DB_CONFIG.databaseId,
        DB_CONFIG.collections.workshopRegistrations,
        ID.unique(),
        { workshopId, userId, bookedAt: new Date().toISOString() }
      );
      return true;
    }
  } catch {
    return false;
  }
}

export async function fetchUserWorkshopBookings(userId: string): Promise<any[]> {
  try {
    const response = await databases.listDocuments(
      DB_CONFIG.databaseId,
      DB_CONFIG.collections.workshopRegistrations,
      [Query.equal("userId", userId)]
    );
    return response.documents;
  } catch {
    return [];
  }
}

// ─── Landing Stats & Paths ─────────────────────────────────────────────────────

export async function fetchGlobalStats(): Promise<any> {
  return {
    totalStudents: 12500,
    placedMTO: 420,
    courseCompletionRate: 94,
  };
}

export interface PathDoc {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  level: string;
  duration: string;
  xpReward: number;
  badge: string;
  coursesCount: number;
  modules?: any[];
  description?: string;
  hours?: number;
  studentsCount?: number;
  rating?: number;
  coverImage?: string;
  $id?: string;
  [key: string]: any;
}

export async function fetchPaths(): Promise<PathDoc[]> {
  try {
    const response = await databases.listDocuments(
      DB_CONFIG.databaseId,
      DB_CONFIG.collections.paths,
      [Query.limit(20)]
    );
    return response.documents as unknown as PathDoc[];
  } catch {
    return [];
  }
}

// ─── Job Applications ────────────────────────────────────────────────────────────────────────────────

export interface JobApplicationDoc {
  jobId: string;
  userId: string;
  jobTitle: string;
  company: string;
  status: "applied" | "reviewing" | "interviewing" | "offered" | "rejected";
  appliedAt: string;
  notes?: string;
}

export async function createJobApplication(
  userId: string,
  jobId: string,
  jobTitle: string,
  company: string
): Promise<boolean> {
  try {
    await databases.createDocument(
      DB_CONFIG.databaseId,
      DB_CONFIG.collections.jobApplications,
      ID.unique(),
      {
        jobId,
        userId,
        jobTitle,
        company,
        status: "applied",
        appliedAt: new Date().toISOString(),
      }
    );
    return true;
  } catch {
    return false;
  }
}

export async function fetchUserJobApplications(userId: string): Promise<any[]> {
  try {
    const response = await databases.listDocuments(
      DB_CONFIG.databaseId,
      DB_CONFIG.collections.jobApplications,
      [Query.equal("userId", userId), Query.limit(50)]
    );
    return response.documents;
  } catch {
    return [];
  }
}

export async function updateApplicationStatus(
  docId: string,
  status: JobApplicationDoc["status"],
  notes?: string
): Promise<boolean> {
  try {
    const updateData: Record<string, any> = { status };
    if (notes !== undefined) updateData.notes = notes;
    await databases.updateDocument(
      DB_CONFIG.databaseId,
      DB_CONFIG.collections.jobApplications,
      docId,
      updateData
    );
    return true;
  } catch {
    return false;
  }
}
