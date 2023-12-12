function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export async function GET() {
  await sleep(5000);
  return Response.json({ foo: "bar" });
}

export const runtime = "edge";
