# 💰 Savebille - Expense Tracker

A modern expense tracking web application built with React, TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

## ✨ Features

- 🔐 User authentication (Sign up / Sign in)
- 📊 Dashboard with expense statistics
- ➕ Add, view, and delete expenses
- 🏷️ Categorize expenses
- 📅 Track expenses by date
- 💾 Real-time data synchronization with Supabase
- 🎨 Beautiful UI with shadcn/ui components
- 🌙 Dark mode support (coming soon)

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
2. **Add Expense**: Click the "Add Expense" button to record a new expense
3. **View Expenses**: See all your expenses in the dashboard
4. **Track Statistics**: Monitor your total expenses and monthly spending
5. **Delete Expense**: Remove any expense you no longer need

## 🗄️ Database Schema

The application uses the following Supabase table:

### `expenses` table

- `id` (uuid) - Primary key
- `user_id` (uuid) - Foreign key to auth.users
- `amount` (decimal) - Expense amount
- `description` (text) - Expense description
- `category` (text) - Expense category
- `date` (date) - Date of expense
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

Made with ❤️ by your team
