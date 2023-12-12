import { type NextRequest } from "next/server";

function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export async function GET(request: NextRequest) {
  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  const response1 = { state: "pending" };
  writer.write(encoder.encode("data: " + JSON.stringify(response1) + "\n\n"));
  const response = await fetch(request.nextUrl.origin + "/api/longrunning", {
    method: "GET",
  });
  const data = await response.json();
  const response2 = { state: "done", payload: data };
  writer.write(encoder.encode("data: " + JSON.stringify(response2) + "\n\n"));
  writer.write(encoder.encode("data: [DONE]\n\n"));
  writer.close();

  return new Response(responseStream.readable, {
    headers: {
      // "Content-Type": "text/event-stream; charset=utf-8",
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export const runtime = "edge";
