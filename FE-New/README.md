# Personal Expense Tracker

A modern web application for tracking personal expenses with features like expense management, categorization, search, and data visualization.

## Features

- 🔐 User Authentication (Login/Register)
- 💰 Add, Edit, and Delete Expenses
- 📊 Visual Expense Summary with Charts
- 🔍 Search Expenses by Description or Category
- 📱 Responsive Design
- 📋 Categorized Expense Management
- 📈 Real-time Updates

## Tech Stack

- React 18.3.1
- TypeScript 5.5.3
- Vite 5.4.2
- Tailwind CSS 3.4.1
- Recharts 2.12.2 (for data visualization)
- Lucide React 0.344.0 (for icons)
- Date-fns 3.3.1 (for date formatting)

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd expense-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Preview production build:
```bash
npm run preview
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code using ESLint

### Project Structure

```
src/
├── api/              # API service layer
│   ├── auth.ts       # Authentication API
│   └── expenses.ts   # Expenses API
├── components/       # React components
│   ├── auth/         # Authentication components
│   ├── layout/       # Layout components
│   └── ...          # Other components
├── context/         # React context providers
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

### Testing Credentials

For testing the application, use these credentials:
- Email: test@example.com
- Password: password

## API Integration

The project uses a mock API layer that can be easily replaced with real API endpoints. To integrate with your backend:

1. Update the API functions in `src/api/auth.ts` and `src/api/expenses.ts`
2. Replace mock implementations with actual HTTP requests
3. Update error handling as needed

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.