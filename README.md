# Storefront

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Storefront is a web application designed to manage products and categories in an online store. It provides functionalities for user authentication, product management, and category management, all within a user-friendly dashboard interface.

## Features

- User Authentication (Sign In/Sign Up)
- Dashboard Overview
- Product Management (Create, Read, Update, Delete)
- Category Management (Create, Read, Update, Delete)
- Pagination, Sorting, and Search functionalities for products
- Toast notifications for user feedback

## Technologies Used

- **Frontend:**
  - React
  - TypeScript
  - React Query
  - React Router
  - Tailwind CSS
- **Backend:**
  - Supabase (PostgreSQL database and authentication)
- **Icons:**
  - Lucide React
- **Notifications:**
  - Sonner

## Installation

To get a local copy up and running, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/storefront.git
   cd storefront
   ```

2. **Install dependencies:**

   ```bash
   bun install
   ```

3. **Setup environmental variables:** Create a `.env` file in the root directory and add your Supabase credentials:

   ```bash
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
   ```

4. **Start the development server:**
   ```bash
   bun run dev
   ```

## Usage

Once the development server is running, you can access the application at http://localhost:3000.

- Authentication:
  Navigate to `/auth` to sign in or sign up.
- Dashboard:
  After signing in, you will be redirected to the dashboard where you can manage products and categories.

## Project Structure

```
storefront/
├── public/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── categories/
│   │   ├── dashboard/
│   │   ├── products/
│   │   └── ui/
│   ├── integrations/
│   ├── pages/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── ...
│   ├── providers/
│   ├── types/
│   ├── App.tsx
│   ├── index.tsx
│   └── ...
├── .env
├── package.json
└── README.md
```

## Contributing
Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.