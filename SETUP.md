
# 🚀 Next.js App Setup & Installation Guide

  

This guide will help you set up, install, and run your Next.js application.

  

---

  

## 📌 Prerequisites

 
Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (Recommended: Latest LTS)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) (if running locally)
- [Git](https://git-scm.com/)  

---

 
## 📥 1. Clone the Repository


Run the following command in your terminal:

```sh

git  clone  https://github.com/tusk-social/tusk-webapp.git
cd  tusk-webapp

```

  

---

  

## 📦 2. Install Dependencies

  

Using **npm**:

```sh

npm  install

```

  

Or using **Yarn**:

  

```sh

yarn  install

```

  

---

  

## ⚙️ 3. Set Up Environment Variables

  

Create a `.env.local` file in the root directory:

  

```sh

touch  .env.local

```

  

Copy and paste the following environment variables into `.env.local`:

  

```ini

IMGFLIP_USERNAME=<GET A FREE ACCOUNT FROM IMGFLIP - FOR MEME GENERATOR>
IMGFLIP_PASSWORD=<IMGFLIP PASSWORD>

  
DEEPSEEK_API_KEY=<DEEPSEEK API KEY FOR AI ENHANCEMENT>
DATABASE_URL=<POSTGRES CONNECTION STRING>
BLOB_READ_WRITE_TOKEN=<VERCEL BLOB TOKEN>

```
Save the file.

---

  

## 🗄️ 4. Database Setup

  

If using **Neon.tech (Hosted PostgreSQL)**, your database is already provisioned.

  

For **local PostgreSQL**, follow these steps:

  

1. Create a new database:

```sh

createdb my_database

```

  

2. Update your `.env.local` file with your local database URL:

```ini

DATABASE_URL="postgres://your_user:your_password@localhost:5432/my_database"

```

  

3. Run database migrations (if using Prisma or a similar ORM):

```sh

npx prisma migrate dev

```

  

---

  

## ▶️ 5. Run the Development Server

  

Start the Next.js server in development mode:

  

```sh

npm  run  dev

```

  

or

  

```sh

yarn  dev

```

  

Your application will be available at **[http://localhost:3000](http://localhost:3000)**.

  

---

  

## 🚀 6. Running in Production

  

To run the application in production:

  

1. Build the application:

```sh

npm run build

```

  

2. Start the production server:

```sh

npm start

```

  

For deployment, you can use **Vercel**, **Docker**, or a cloud provider like AWS, DigitalOcean, or Heroku.

  

---

  

## 🛠️ 7. Useful Commands

  

### 📄 Linting & Formatting

  

To check and fix linting issues:

  

```sh

npm  run  lint

```

To format code:

  

```sh

npm  run  format

```

  

### 🛑 Stopping the Server

  

To stop the development server:

  

```sh

CTRL  +  C

```

  

For production servers running in the background:

  

```sh

kill $(lsof  -t  -i:3000)

```

  

---

  

## 🛠️ 8. Troubleshooting

  

### ❌ Dependency Issues

  

If you encounter issues with dependencies, try:

  

```sh

rm  -rf  node_modules  package-lock.json && npm  install

```

  

Or if using **Yarn**:

  

```sh

rm  -rf  node_modules  yarn.lock && yarn  install

```

  

### ❌ Database Connection Issues

  

- Ensure PostgreSQL is running:

```sh

systemctl start postgresql

```

- Verify database credentials in `.env.local`.

  

- Restart the database server:

  

```sh

systemctl restart postgresql

```

  

### ❌ Port Already in Use

  

If you see an error that port 3000 is already in use, run:

  

```sh

kill $(lsof  -t  -i:3000)

```

  

Then try running the server again.

  

---

  
## ✅ 9. Done!

  

Your Next.js app is now set up and running! 🎉🚀

  

If you need further assistance, reach out 😊