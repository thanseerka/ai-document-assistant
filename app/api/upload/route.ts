import { NextResponse } from "next/server";
import PDFParser from "pdf2json";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No PDF file provided" },
        { status: 400 },
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<{
      pages: number;
      text: string;
    }>((resolve, reject) => {
      const parser = new PDFParser();

      parser.on("pdfParser_dataError", (error) => {
        reject(error.parserError);
      });

      parser.on("pdfParser_dataReady", (pdfData) => {
        const pages = pdfData.Pages.length;

        const pageTexts = pdfData.Pages.map((page, index) => {
          const pageText = page.Texts.map((textItem) => {
            return textItem.R.map((r) => decodeURIComponent(r.T)).join("");
          }).join(" ");

          return `--- Page ${index + 1} ---\n${pageText}`;
        });

        resolve({
          pages,
          text: pageTexts.join("\n\n"),
        });
      });

      parser.parseBuffer(buffer);
    });

    console.log("Pages:", result.pages);
    console.log("Extracted text:", result.text);

    return NextResponse.json({
      filename: file.name,
      pages: result.pages,
      text: result.text,
    });
  } catch (error) {
    console.error("PDF processing error:", error);

    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 },
    );
  }
}
