# Tours Application

This is a Node.js application where users can book, create, and view different tours. The application uses Express as the web framework.

## Table of Contents
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

## Getting Started

These instructions will help you set up the project on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/guivecchi12/tours-be.git
    ```
2. Navigate to the project directory:
    ```sh
    cd tours-be
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```

### Usage

To start the development server, run:
```sh
npm run dev
```
The application will be available at http://localhost:3000.

### API Endpoints

Tours
GET /api/v1/tours - Get all tours
POST /api/v1/tours - Create a new tour
GET /api/v1/tours/:id - Get a tour by ID
PATCH /api/v1/tours/:id - Update a tour by ID
DELETE /api/v1/tours/:id - Delete a tour by ID

Bookings
GET /api/bookings - Get all bookings
POST /api/bookings - Create a new booking
GET /api/bookings/:id - Get a booking by ID
PUT /api/bookings/:id - Update a booking by ID
DELETE /api/bookings/:id - Delete a booking by ID