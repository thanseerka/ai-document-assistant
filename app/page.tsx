"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [documentText, setDocumentText] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [asking, setAsking] = useState(false);

  async function uploadFile() {
    if (!file) return;

    setLoading(true);
    setAnswer("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setDocumentText(data.text);
    } catch (error) {
      console.error(error);
      setAnswer("Failed to process the PDF.");
    } finally {
      setLoading(false);
    }
  }

  async function askQuestion() {
    if (!question.trim() || !documentText) return;

    setAsking(true);
    setAnswer("");

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          documentText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Question failed");
      }

      setAnswer(data.answer);
    } catch (error) {
      console.error(error);
      setAnswer("Failed to get an answer.");
    } finally {
      setAsking(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}

      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-xl font-bold">AI Document Reader</h1>

            <p className="text-sm text-slate-500">
              Understand your documents with AI
            </p>
          </div>

          <div className="text-sm text-slate-500">AI Assistant</div>
        </div>
      </header>

      {/* Main */}

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Upload */}

        {!documentText && (
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border bg-white p-10 shadow-sm">
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                  📄
                </div>

                <h2 className="text-2xl font-semibold">Upload your document</h2>

                <p className="mt-2 text-slate-500">
                  Upload a PDF and ask questions about its contents.
                </p>
              </div>

              <div className="mt-8 rounded-xl border-2 border-dashed border-slate-300 p-8 text-center">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(event) => {
                    const selectedFile = event.target.files?.[0];

                    if (selectedFile) {
                      setFile(selectedFile);
                      setAnswer("");
                    }
                  }}
                  className="mx-auto block text-sm"
                />

                {file && (
                  <div className="mt-5">
                    <p className="font-medium">{file.name}</p>

                    <p className="mt-1 text-sm text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>

                    <button
                      onClick={uploadFile}
                      disabled={loading}
                      className="mt-5 rounded-lg bg-slate-900 px-6 py-3 font-medium text-white hover:bg-slate-700 disabled:opacity-50"
                    >
                      {loading ? "Processing..." : "Process Document"}
                    </button>
                  </div>
                )}
              </div>

              <p className="mt-5 text-center text-xs text-slate-400">
                PDF files only
              </p>
            </div>
          </div>
        )}

        {/* Reader */}

        {documentText && (
          <div className="grid min-h-[650px] gap-6 lg:grid-cols-2">
            {/* Document */}

            <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <div className="flex items-center justify-between border-b px-6 py-4">
                <div>
                  <p className="font-semibold">{file?.name}</p>

                  <p className="text-sm text-slate-500">Document preview</p>
                </div>

                <button
                  onClick={() => {
                    setFile(null);
                    setDocumentText("");
                    setAnswer("");
                    setQuestion("");
                  }}
                  className="text-sm text-slate-500 hover:text-slate-900"
                >
                  New document
                </button>
              </div>

              <div className="h-[580px] overflow-y-auto p-6">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-700">
                  {documentText}
                </pre>
              </div>
            </section>

            {/* AI */}

            <section className="flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm">
              <div className="border-b px-6 py-4">
                <p className="font-semibold">Ask AI</p>

                <p className="text-sm text-slate-500">
                  Ask questions about this document
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {!answer && (
                  <div className="flex h-full items-center justify-center text-center">
                    <div>
                      <div className="text-4xl">✨</div>

                      <p className="mt-4 font-medium">
                        Ask anything about the document
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        Try asking about coverage, exclusions or claims.
                      </p>
                    </div>
                  </div>
                )}

                {answer && (
                  <div>
                    <div className="rounded-xl bg-slate-50 p-5">
                      <p className="whitespace-pre-wrap leading-7 text-slate-700">
                        {answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Question */}

              <div className="border-t p-5">
                <div className="flex gap-3">
                  <input
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        askQuestion();
                      }
                    }}
                    placeholder="Ask a question..."
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                  />

                  <button
                    onClick={askQuestion}
                    disabled={asking || !question.trim()}
                    className="rounded-xl bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-700 disabled:opacity-50"
                  >
                    {asking ? "..." : "Ask"}
                  </button>
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Answers are based on the uploaded document.
                </p>
              </div>
            </section>
          </div>
        )}
      </main>
    </main>
  );
}
