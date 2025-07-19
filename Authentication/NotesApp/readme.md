# 📘 Project Title

Note app which lets you add the notes.

---

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

- Mongo URI

## API endPoint

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

## Image walkthrough

![alt text](https://github.com/girijakangutkar/SchoolMgmt/blob/main/Screenshot%20(168).png)

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/your-repo-name.git

# Navigate into the project directory
cd your-repo-name

# Install dependencies
npm install

# Deployed link
https://notehere.vercel.app/

# Start the development server
npm start
```
