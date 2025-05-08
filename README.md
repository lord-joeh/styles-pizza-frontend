# Pizza Ordering System - Frontend

A modern, responsive React-based pizza ordering system with separate interfaces for customers and administrators. This application provides a seamless experience for ordering pizzas online while giving administrators powerful tools to manage the business.

## Features

### Customer Features
- Browse available pizzas with detailed descriptions and prices
- Customize pizza orders with various ingredients
- Real-time cart management
- Order tracking and history
- User authentication and profile management
- Favorite pizzas functionality

### Admin Features
- Comprehensive dashboard for business overview
- Pizza menu management (add, edit, delete pizzas)
- Ingredient inventory management
- Order management and tracking
- Real-time order status updates

## Technology Stack

- **Frontend Framework**: React.js
- **UI Library**: Material-UI (MUI)
- **State Management**: Context API
  - AuthContext for authentication
  - CartContext for shopping cart
  - ThemeContext for customizable theming
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Form Handling**: Custom hooks and validation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/lord-joeh/styles-pizza-frontend
cd pizza-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add necessary environment variables:
```env
REACT_APP_API_URL=your_api_url
```

4. Start the development server:
```bash
npm start
```

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

## Authentication

The application uses token-based authentication with the following features:
- JWT token management
- Protected routes for both customer and admin areas
- Password reset functionality
- Email verification

## Routing Structure

- `/` - Home page
- `/login` - User login
- `/register` - User registration
- `/customer/*` - Protected customer routes
  - `/dashboard` - Customer dashboard
  - `/pizzas` - Pizza listing
  - `/cart` - Shopping cart
  - `/orders` - Order history
- `/admin/*` - Protected admin routes
  - `/dashboard` - Admin dashboard
  - `/pizzas` - Pizza management
  - `/ingredients` - Ingredient management
  - `/orders` - Order management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material-UI for the beautiful component library
- React Router for seamless navigation
- All contributors who have helped shape this project