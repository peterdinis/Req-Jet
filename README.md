# ReqJet - API Testing Application

ReqJet is a modern, web-based API testing tool similar to Postman, built with Next.js. It provides a clean and intuitive interface for developers to test, debug, and document HTTP APIs.

## Features

- 🚀 **Modern UI** - Clean, dark-themed interface built with modern web technologies
- 🔄 **HTTP Methods** - Support for GET, POST, PUT, DELETE, PATCH, and more
- 📝 **Request Builder** - Easy-to-use interface for constructing API requests
- 🔐 **Authentication** - Multiple auth methods including Bearer Token, Basic Auth, and API Keys
- 📊 **Response Viewer** - Pretty-printed JSON response formatting with syntax highlighting
- 🌐 **CORS Support** - Built-in handling for cross-origin requests
- 📁 **File Upload** - Support for multipart/form-data and file uploads
- ⚡ **Real-time Testing** - Instant feedback with live response data

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

1. Create .env.local file and add here this variables
```bash
  DATABASE_URL="your database url"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your supabase publishable key"
NEXT_PUBLIC_SUPABASE_URL="your supabase project url"
```

2. Clone the repository:
```bash
git clone <repository-url>
cd reqjet
pnpm i 
pnpm run dev
```