# 📘 Project Title

Note app which lets you add the notes. Frontend

---

## Tools

-- Version is controlled by gitHub
-- Deployed on Vercel

## 🚀 Features

- Add note based on user role: "uses", "admin", "moderator"
- Login and signUp feature with encrypted password using bcrypt.
- Edit and delete feature for notes

---

## 🛠️ Tech Stack

- Frontend: React, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB
- Icons: Lucide React

---

## Env Secret

- VITE_BASE_URI //Deployed backend link

--User routes
post /signup
{
---- name:String, required
---- email:String, required
---- password: String, required
---- role: String, default:"role"
}

post /login
{
---- email:String, required
---- password: String, required
}

post /notes
{
---- title: String,
---- content: String,
---- createdBy: userId
}

get /notes{
---- title: String,
---- content: String,
---- createdBy: userId
}

put /notes/:id
{
---- title: String,
---- content: String,
---- createdBy: userId
}

delete /notes/:id{
---- title: String,
---- content: String,
---- createdBy: userId
}

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/girijakangutkar/ExpressRouting/tree/master/FullStack/Notes.git

# Navigate into the project directory
cd your-repo-name

# Install dependencies
npm install

# Start the development server
npm start

#Deployed Backend on vercel
https://notehere-hd3sjd8px-girijakangutkars-projects.vercel.app/

#GitHub project link
https://github.com/girijakangutkar/ExpressRouting/tree/master/FullStack/Notes
```
