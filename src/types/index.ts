export interface Profile {
  id: string;
  updated_at?: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  email: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: "income" | "expense";
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface GlobalCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: "income" | "expense";
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  category_id?: string;
  user_id: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  amount: number;
  description?: string;
  date: string;
  type: "income" | "expense";
  category_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  categories?: {
    name: string;
    icon: string;
    color: string;
  };
}
