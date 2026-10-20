# AI Document Assistant

An AI-powered document Q&A application that allows users to upload PDF documents and ask questions in natural language.

**Project status: 🚧 In Progress**

I'm building this project incrementally, starting with a PDF question-answering prototype and evolving it into a Retrieval-Augmented Generation (RAG) application.

## Tech Stack

### Current Prototype
- Next.js
- React
- OpenAI API
- PDF text extraction

### Planned Architecture
- Next.js frontend
- NestJS backend
- PostgreSQL database
- pgvector for vector similarity search
- LLM APIs for embeddings and answer generation

> Planned technologies are not yet considered implemented. This section will be updated as each component is integrated and tested.

## Current Features

- [x] Initial Next.js application
- [x] PDF text extraction
- [x] Initial AI question-answering flow

## Roadmap

- [ ] Set up NestJS backend
- [ ] Integrate PostgreSQL
- [ ] Enable pgvector
- [ ] Implement document chunking
- [ ] Generate and store embeddings
- [ ] Retrieve relevant chunks through semantic search
- [ ] Generate answers using retrieved document context
- [ ] Add validation and error handling
- [ ] Add automated tests
- [ ] Configure GitHub Actions for CI

## Getting Started

### Prerequisites

- Node.js compatible with the project dependencies
- npm
- OpenAI API key

### 1. Clone the repository

```bash
git clone https://github.com/than­seerka/ai-document-assistant.git
cd ai-document-assistant
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root.

Add the environment variables required by the current implementation. For example:

```env
OPENAI_API_KEY=your_openai_api_key
```

Check the source code for the exact environment variable names. Never commit API keys or other secrets.

### 4. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 5. Verify the production build

```bash
npm run build
```

Run additional scripts only if they are defined in `package.json`.

## Architecture

### Current Prototype Flow

1. The user uploads a PDF.
2. The application extracts the document text.
3. The user submits a question.
4. The application sends the available document context and question to the LLM.
5. The answer is displayed in the interface.

### Target RAG Flow

1. Upload a document through Next.js.
2. Process it through the NestJS backend.
3. Extract and split the text into chunks.
4. Generate embeddings using an embedding model.
5. Store document chunks and embeddings in PostgreSQL with pgvector.
6. Retrieve relevant chunks using vector similarity search.
7. Send the retrieved context and question to the LLM.
8. Return a context-grounded answer.

## Development Status

This project is under active development.

The next major milestone is to introduce the NestJS backend, PostgreSQL persistence, vector embeddings, and semantic retrieval.

Progress will be tracked through GitHub Issues, commits, and the project roadmap.

## Contributing

Suggestions, bug reports, and improvement ideas are welcome through GitHub Issues.

## License

No license has been added yet. Until one is selected, do not assume the project is licensed for reuse or redistribution.
