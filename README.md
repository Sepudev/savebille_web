# 💰 Savebille - Expense Tracker

A modern expense tracking web application built with React, TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

## ✨ Features

- 🔐 User authentication (Sign up / Sign in)
- 📊 Dashboard with comprehensive statistics
- ➕ Add, view, and delete transactions (income & expenses)
- 🏷️ Custom categories with icons and colors
- 💰 Income and expense tracking
- 📅 Track transactions by date
- 💾 Real-time data synchronization with Supabase
- 🎨 Beautiful UI with shadcn/ui components
- 🌙 Responsive design
- 📈 Balance calculation (income - expenses)
- 📋 Monthly expense tracking

## 🚀 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Supabase** - Backend and authentication
- **React Router** - Navigation
- **Lucide React** - Icons

## 📦 Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd savebille_web
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up Supabase (see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions)

4. Create a `.env` file in the root directory and add your Supabase credentials:

```bash
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

5. Start the development server:

```bash
pnpm dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

## 📝 Usage

1. **Sign Up/Login**: Create an account or log in with your existing credentials
2. **Create Categories**: Navigate to Categories page and create custom categories with icons and colors
3. **Add Transactions**: Click "Add Transaction" to record income or expenses
4. **View Dashboard**: Monitor your balance, total income, and expenses
5. **Track Statistics**: View monthly expenses and overall financial health
6. **Manage Data**: Edit or delete transactions and categories as needed

## 🗄️ Database Schema

The application uses the following Supabase tables:

### `profiles` table

- `id` (uuid) - Primary key, references auth.users
- `email` (text) - User email
- `username` (text) - Unique username
- `full_name` (text) - User's full name
- `avatar_url` (text) - Profile picture URL
- `created_at` (timestamp) - Account creation date
- `updated_at` (timestamp) - Last profile update

### `categories` table

- `id` (uuid) - Primary key
- `name` (text) - Category name
- `icon` (text) - Emoji icon
- `color` (text) - Hex color code
- `type` (text) - 'income' or 'expense'
- `user_id` (uuid) - Foreign key to profiles
- `created_at` (timestamp) - Creation timestamp
- `updated_at` (timestamp) - Last update timestamp

### `transactions` table

- `id` (uuid) - Primary key
- `amount` (decimal) - Transaction amount
- `description` (text) - Transaction description
- `date` (date) - Transaction date
- `type` (text) - 'income' or 'expense'
- `category_id` (uuid) - Foreign key to categories
- `user_id` (uuid) - Foreign key to profiles
- `created_at` (timestamp) - Creation timestamp
- `updated_at` (timestamp) - Last update timestamp

### `budgets` table

- `id` (uuid) - Primary key
- `name` (text) - Budget name
- `amount` (decimal) - Budget limit
- `spent` (decimal) - Amount spent
- `category_id` (uuid) - Foreign key to categories (optional)
- `user_id` (uuid) - Foreign key to profiles
- `start_date` (date) - Budget start date
- `end_date` (date) - Budget end date
- `created_at` (timestamp) - Creation timestamp
- `updated_at` (timestamp) - Last update timestamp

## 🔒 Security

- Row Level Security (RLS) enabled
- Users can only access their own expenses
- Secure authentication with Supabase Auth

## 🛠️ Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## 📂 Project Structure

```
savebille_web/
├── src/
│   ├── components/
│   │   └── ui/           # shadcn/ui components
│   ├── lib/
│   │   ├── supabase.ts   # Supabase client
│   │   └── utils.ts      # Utility functions
│   ├── pages/
│   │   ├── Auth.tsx      # Authentication page
│   │   └── Dashboard.tsx # Main dashboard
│   ├── types/
│   │   └── index.ts      # TypeScript types
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── .env                  # Environment variables (create this)
├── .env.example          # Example environment variables
├── components.json       # shadcn/ui config
├── tailwind.config.js    # Tailwind config
└── SUPABASE_SETUP.md     # Supabase setup guide
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for the styling system

---

Made with ❤️ for expense tracking

import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
globalIgnores(['dist']),
{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```
