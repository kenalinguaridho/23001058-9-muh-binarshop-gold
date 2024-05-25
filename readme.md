# Online Shop Backend

## Description

The Online Shop Backend is a RESTful API web application designed to support e-commerce functionalities. This application enables users to manage products, orders, users, and inventory efficiently. The API is built using Express.js and documented with Swagger to facilitate easy integration and understanding by other developers.

## Key Features

- **Product Management**: Create, read, update, and delete (CRUD) products.
- **Order Management**: Create and manage orders, including payment and order statuses.
- **User Management**: User registration, authentication, and profile management.
- **Address Management**: Create, read, update, and delete (CRUD) user address and update main address for order.
- **API Documentation**: Interactive documentation accessible via Swagger UI.

## Technologies Used

- **Backend Framework**: [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Sequelize](https://sequelize.org/)
- **Authentication**: [JSON Web Token (JWT)](https://jwt.io/)
- **API Documentation**: [Swagger](https://swagger.io/)

## Project Structure

- `app.js`: Main file that initializes the Express server and Swagger.
- `models/`: Contains database model definitions using Sequelize.
- `router/`: Contains API route definitions.
- `controller/`: Contains business logic for each API endpoint.
- `config/`: Contains database configuration and other necessary configurations.
- `lib/`: Contains middleware such as JWT authentication.
- `helpers/`: Contains modules for repeated function

## Getting Started

### Installation

Clone this repository and install the dependencies using npm:

```sh
git clone https://github.com/kenalinguaridho/23001058-9-muh-binarshop-gold.git
cd 23001058-9-muh-binarshop-gold
npm install
