"use server";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import {getPullRequestDiff} from "@/module/github/lib/github";
import {canCreateReview ,incrementReviewCount} from "@/module/payment/lib/subscription";
export async function reviewPullRequest(
  owner: string,
  repo: string,
  prNumber: number
) {
    try{
  const repository = await prisma.repository.findFirst({
    where: {
      owner,
      name: repo,
    },
    include: {
      user: {
        include: {
          accounts: {
            where: {
              providerId: "github",
            },
          },
        },
      },
    },
  });
  if(!repository) {
    throw new Error(`Repository ${owner}/${repo} not found in the database.`);
  }

  const canReview = await canCreateReview(repository.user.id, repository.id);
  if (!canReview) {
    throw new Error("Review limit reached for this repository. Please upgrade your plan to create more reviews.");
  }

  const githubAccount = repository.user.accounts[0];
  if (!githubAccount?.accessToken) {
    throw new Error(`GitHub account for user ${repository.user.id} not found.`);
  }
  const token=githubAccount.accessToken;
  const {title} = await getPullRequestDiff(token,owner, repo, prNumber);
  await inngest.send({
    name:"pr.review.requested",
    data:{
      owner,
        repo,
        prNumber,
        userId:repository.user.id,
    }
  })

  await incrementReviewCount(repository.user.id, repository.id);
  return {
    success:true,
    message:`Pull request #${prNumber} in ${owner}/${repo} has been reviewed.`
  }; 
} catch(error){
    try{
        const repository = await prisma.repository.findFirst({
            where: {
              owner,
              name: repo
            } 
        });
        if(repository) {
            await prisma.review.create({
                data: {
                    repositoryId: repository.id,
                    prNumber,
                    prTitle:"Failed to fetch PR title",
                    prUrl:`https://github.com/${owner}/${repo}/pull/${prNumber}`,
                    review:'Error:${error instanced Error ? error.message : "Unknown error"}',
                    status:'failed'
                }
            })
        }
    }
    catch(dberror){
        console.error("failed to save error in database:", dberror);
    };
  }     
}

