# Nexus CRM

Nexus CRM is a modern, high-performance Customer Relationship Management system built with React and Node.js. It features a sleek glassmorphic UI, real-time analytics, and secure authentication.

## ✨ Features
- **Dashboard:** Real-time stats on revenue, active users, and deals.
- **Deals Pipeline:** Kanban board for tracking opportunity stages with drag-and-drop.
- **Contacts Management:** Professional contact list with quick-add modals.
- **Security:** Password hashing with `bcryptjs` and JWT session persistence.
- **Responsive Design:** Optimized for both desktop and mobile views.

## 🚀 Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Recharts.
- **Backend:** Node.js, Express, Prisma, SQLite.
- **Authentication:** JWT, bcryptjs.

## 🛠️ Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Godfather59/crm-website.git
   cd crm-website
   ```

2. **Install dependencies**
   ```bash
   # Root dependencies
   npm install

   # Client dependencies
   cd client
   npm install

   # Server dependencies
   cd ../server
   npm install
   ```

3. **Backend Configuration**
   - Create a `.env` file in the `server/` directory (use `.env.example` as a template).
   - Run migrations:
     ```bash
     npx prisma migrate dev
     ```

4. **Start the application**
   ```bash
   # Server (from /server)
   npm run dev

   # Client (from root)
   npm run dev
   ```

## 📄 License
MIT
