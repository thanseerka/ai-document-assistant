import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { question, documentText } = body;

    if (!question || !documentText) {
      return NextResponse.json(
        { error: "Question and document text are required" },
        { status: 400 },
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      input: [
        {
          role: "system",
          content: `
You are an AI document assistant.

Answer the user's question ONLY using the provided document.

If the answer cannot be found in the document, say:
"I couldn't find this information in the document."

Be concise and factual.

The document contains page markers such as:
--- Page 1 ---
--- Page 2 ---

When possible, mention the relevant page number.
          `,
        },
        {
          role: "user",
          content: `
DOCUMENT:

${documentText}

QUESTION:

${question}
          `,
        },
      ],
    });

    return NextResponse.json({
      answer: response.output_text,
    });
  } catch (error) {
    console.error("AI error:", error);

    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 },
    );
  }
}
