// src/inngest/functions.ts
import { inngest } from "../client";
import prisma from "@/lib/db";
import { indexCodebase } from "@/module/ai/lib/rag";
import { getRepoFileContents } from "@/module/github/lib/github";
import { Octokit } from "octokit";
export const processTask = inngest.createFunction(
  { id: "process-task", triggers: { event: "app/task.created" } },
  async ({ event, step }) => {
    const result = await step.run("handle-task", async () => {
      return { processed: true, id: event.data.id };
    });

    await step.sleep("pause", "1s");

    return { message: `Task ${event.data.id} complete`, result };
  }
);

export const indexRepo = inngest.createFunction(
  {
    id: "index-repo",
    triggers: {
      event: "repository.connected",
    },
  },
  async ({ event, step }) => {
    const { owner, repo, userId } = event.data;

    // Fetch the files from the repository
    const files = await step.run("fetch-files", async () => {
      const account = await prisma.account.findFirst({
        where: {
          userId: userId,
          providerId: "github",
        },
      });

      if (!account?.accessToken) {
        throw new Error("No access token found for user");
      }

      // Test GitHub authentication
      const octokit = new Octokit({
        auth: account.accessToken,
      });

      const { data: user } =
        await octokit.rest.users.getAuthenticated();
      // Test repository access
      const { data: repository } =
        await octokit.rest.repos.get({
          owner,
          repo,
        });

      console.log(
        "Repository found:",
        repository.full_name
      );

      // Fetch repository files
      return await getRepoFileContents(
        account.accessToken,
        owner,
        repo
      );
    });

    await step.run("index-codebase", async () => {
      await indexCodebase(
        `${owner}/${repo}`,
        files
      );
    });

    return {
      success: true,
      indexedFiles: files.length,
    };
  }
);