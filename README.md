# PawPal

PawPal is a pet care website. In this version (CA2 Web Development) the site is also a small online shop for pet products. Users can register, log in, see the products, add them to a basket and finish a simulated checkout.

Built with HTML, CSS, JavaScript, Node.js, Express and MySQL.

## Project folders

- `server.js` is the Express server (routes /register, /login and /products)
- `database.sql` creates the database, the tables and the 5 products
- `public/` has the website files (HTML pages, style.css, script.js and images)
- `.env.example` shows the database settings (the real `.env` file is not uploaded)

## How to run the project

1. Open `database.sql` in MySQL Workbench and run it. This creates the `pawpal` database.
2. Copy `.env.example`, rename the copy to `.env` and write your MySQL password in it.
3. In the VS Code terminal, inside the project folder, run:

```
npm install
node server.js
```

4. The terminal shows "Server running at http://localhost:3000" and "MySQL connected successfully".
5. Open http://localhost:3000 in the browser (not Live Server, because the pages need the Node.js server).

## Pages

- `index.html` home page
- `services.html` services, products and basket
- `checkout.html` checkout and order confirmation
- `register.html` and `login.html` user account
- `about.html` and `contact.html`

## Author

Leticia Cristina Souza de Almeida, CCT College Dublin, Higher Diploma in Computing
