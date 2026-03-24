# User Management App

A Next.js frontend for managing users — supports listing, creating, editing, deleting, and bulk importing users via CSV.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Fetch


## Setup & Installation

1. Clone the repository

   git clone https://github.com/kamaru-x/giapp.git
   cd frontend

2. Install dependencies

   npm install

3. Create a .env.local file in the root

   NEXT_PUBLIC_API_URL=http://localhost:8000/api

4. Start the development server

   npm run dev

The app will be available at http://localhost:3000


## Environment Variables

| Variable               | Description          | Example                        |
|------------------------|----------------------|--------------------------------|
| NEXT_PUBLIC_API_URL    | Backend API base URL | http://localhost:8000/api      |


## Pages

| Route                  | Description                        |
|------------------------|------------------------------------|
| /users                 | List all users                     |
| /users/create          | Create a new user                  |
| /users/[id]/details    | View user details                  |
| /users/[id]/edit       | Edit a user                        |
| /users/upload          | Bulk import users from a CSV file  |


## Features

### User List
- Displays all users in a table
- Search by name or email
- Responsive — renders as cards on mobile
- Delete with confirmation dialog

### Create / Edit User
- Form with field-level validation
- Errors returned from the API are displayed inline under each field

### Upload CSV
- Drag and drop or click to browse
- Validates .csv extension and file size before upload
- Displays a summary of saved and rejected rows after upload
- Failed rows are shown in a table with the problematic columns highlighted in red
- Error message shown under each invalid cell


## Project Structure

app/
├── users/
│   ├── page.tsx                  # User list
│   ├── columns.tsx               # Table column definitions
│   ├── create/
│   │   └── page.tsx              # Create user
│   ├── [id]/
│   │   ├── details/
│   │   │   └── page.tsx          # User details
│   │   └── edit/
│   │       └── page.tsx          # Edit user
│   └── upload/
│       └── page.tsx              # CSV upload

components/
├── forms/
│   └── user-form.tsx             # Shared create/edit form
├── data-table.tsx                # Reusable table with mobile cards
└── modals/
    └── deleteModal.tsx           # Delete confirmation dialog

hooks/
├── use-get.ts                    # GET requests
├── use-create.ts                 # POST requests
├── use-update.ts                 # PUT/PATCH requests
└── use-delete.ts                 # DELETE requests

lib/
└── api.ts                        # Base fetch wrapper with auth support

constants/
└── endpoints.ts                  # Centralized API endpoint definitions


## CSV Format

The CSV file must contain the following columns:

name,email,age
John Doe,john@example.com,25
Jane Doe,jane@example.com,30


## Live App

URL: https://giapp-khaki.vercel.app/