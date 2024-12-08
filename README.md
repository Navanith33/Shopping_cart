This project is a Full Stack E-commerce Web Application built using the MERN stack (MongoDB, Express, React, Node.js).
It enables users to register, log in, add items to their shopping cart, place orders, and view their order history.
Key Features:
User Authentication: Users can sign up, log in, and receive a JWT token for secure authentication.
Shopping Cart: Users can add items to their cart and proceed to checkout.
Order Management: Users can place orders and view past orders in their history.
Technology Stack:
Backend: Node.js + Express + MongoDB
Frontend: React
API Endpoints Summary
Authentication: First, sign up or log in to obtain a JWT token.
Add items to the cart: Use the user/addtocart endpoint with the product ID.
View Cart: Get the items in the cart with user/getcartItems.
Checkout: Use the user/checkout endpoint to place an order.
View Orders: Use the user/ordersHistory endpoint to view past orders.






First, clone the repository from GitHub to your local machine.
git clone https://github.com/Navanith33/Shopping_cart.git
The back-end of the project is built with Node.js and Express, and it uses MongoDB as the database.
Install the required dependencies using npm:
npm install



