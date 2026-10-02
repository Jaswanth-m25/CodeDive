"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { createWebhook, getRepositories } from "@/module/github/lib/github";
import { inngest } from "@/inngest/client";
import { canConnectRepository,incrementRepositoryCount,decrementRepositoryCount } from "@/module/payment/lib/subscription";

interface Repository {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    language: string | null;
    topics: string[];
}

export const fetchRepositories = async (
    page: number,
    perPage: number = 10
) => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        throw new Error("No session found");
    }

    const githubRepos = await getRepositories(page, perPage);

const dbRepos = await prisma.repository.findMany({
  where: {
    userId: session.user.id,
    isConnected: true,
  },
});

    // Create a set of connected repository IDs
    const connectedRepoIds = new Set(
        dbRepos.map((repo) => repo.githubId)
    );

return githubRepos.map((repo) => ({
    ...repo,
    isConnected: connectedRepoIds.has(BigInt(repo.id))
}));
};

export const connectRepository = async (
  owner: string,
  repo: string,
  githubId: number
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  // Check whether this repository already exists in our database
  const existingRepository = await prisma.repository.findUnique({
    where: {
      githubId: BigInt(githubId),
    },
  });

  // If it already exists and is connected, don't connect it again
  if (existingRepository?.isConnected) {
    throw new Error("Repository is already connected.");
  }

  // Only count the plan limit if this is a new connection
  const canConnect = await canConnectRepository(session.user.id);

  if (!canConnect) {
    throw new Error(
      "Repository limit reached. Please upgrade your plan to connect more repositories."
    );
  }

  const webhook = await createWebhook(owner, repo);

  if (webhook) {
    if (existingRepository) {
      // Repository existed before but was disconnected.
      // Reactivate it instead of creating a new row.
      await prisma.repository.update({
        where: {
          id: existingRepository.id,
        },
        data: {
          isConnected: true,
          name: repo,
          owner,
          fullName: `${owner}/${repo}`,
          url: `https://github.com/${owner}/${repo}`,
        },
      });
      await incrementRepositoryCount(session.user.id);
    } else {
      // Completely new repository
      await prisma.repository.create({
        data: {
          githubId: BigInt(githubId),
          name: repo,
          owner,
          fullName: `${owner}/${repo}`,
          url: `https://github.com/${owner}/${repo}`,
          userId: session.user.id,
          isConnected: true,
        },
      });

      await incrementRepositoryCount(session.user.id);
    }

    try {
      await inngest.send({
        name: "repository.connected",
        data: {
          owner,
          repo,
          userId: session.user.id,
        },
      });
    } catch (error) {
      console.error("Error sending Inngest event:", error);
    }
  }

  return webhook;
};
