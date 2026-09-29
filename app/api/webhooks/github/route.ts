import { NextResponse, NextRequest } from "next/server";
import { reviewPullRequest } from "@/module/ai/actions";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = req.headers.get("x-github-event");
    console.log("Received GitHub webhook event:", event, body);
    if (event === "ping") {
      return NextResponse.json(
        { message: "Pong" },
        { status: 200 }
      );
    }
if (event === "pull_request") {
  const action = body.action;
  const repo = body.repository.full_name;
  const prNumber = body.number;

  const [owner, repoName] = repo.split("/");

  if (
    action === "opened" ||
    action === "reopened" ||
    action === "synchronize"
  ) {
    reviewPullRequest(owner, repoName, prNumber)
      .then(() => {
        console.log(
          `Pull request #${prNumber} in ${repo} has been reviewed.`
        );
      })
      .catch((error) => {
        console.error(
          `Error reviewing pull request #${prNumber} in ${repo}:`,
          error
        );
      });
  }
}

    // TODO: HANDLE LATER

    return NextResponse.json(
      { message: "Event Processes" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}