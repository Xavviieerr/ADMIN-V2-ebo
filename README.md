# Admin Dashboard

A modern admin dashboard built with Next.js, TypeScript, and Tailwind CSS. This application is designed to manage users, dictionary entries, and provide analytics with full backend integration support.

## Features

- 🔐 **Authentication System** - JWT-based authentication with protected routes
- 📊 **Dashboard Analytics** - Real-time statistics and user insights
- 👥 **User Management** - CRUD operations for user data with search and filtering
- 📚 **Dictionary Management** - Manage dictionary entries with search functionality
- 🎨 **Modern UI** - Beautiful dark theme with responsive design
- ⚡ **Performance** - Optimized with Next.js 15 and Turbopack
- 🛡️ **Type Safety** - Full TypeScript support with proper type definitions
- 🔄 **API Integration** - Ready for backend integration with comprehensive API client

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI, Heroicons, Lucide React
- **Forms**: React Hook Form with Yup validation
- **State Management**: React Context for authentication
- **API**: Custom API client with error handling

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd admin-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_AUTH_ENABLED=true
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend Integration

This application is designed to work with a backend API. See [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for detailed API specifications and integration requirements.

### Quick Backend Setup

The frontend expects the following main API endpoints:

- **Authentication**: `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
- **Users**: `/api/users` (GET, POST, PUT, DELETE)
- **Dashboard**: `/api/dashboard/stats`
- **Dictionary**: `/api/dictionary` (GET, POST, PUT, DELETE)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/             # Authentication page
│   ├── dashboard/         # Main dashboard
│   ├── users/            # User management
│   └── dictionary/       # Dictionary management
├── components/            # Reusable components
│   ├── ui/              # UI components (LoadingSpinner, ErrorMessage)
│   ├── layout/          # Layout components (Sidebar, Header)
│   ├── auth/            # Authentication components
│   └── providers/       # Context providers
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication hook
│   └── useApi.ts        # API integration hook
└── lib/                 # Utility libraries
    └── api.ts           # API client configuration
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Authentication Flow

1. Users access the login page at `/login`
2. After successful authentication, users are redirected to `/dashboard`
3. Protected routes automatically redirect to login if not authenticated
4. JWT tokens are stored in localStorage and included in API requests

## API Client Features

- **Automatic Token Management** - JWT tokens are automatically included in requests
- **Error Handling** - Comprehensive error handling with retry functionality
- **Loading States** - Built-in loading states for better UX
- **Type Safety** - Full TypeScript support for API responses

## Customization

### Styling
The application uses Tailwind CSS with a custom dark theme. Colors and styling can be modified in `tailwind.config.js`.

### API Configuration
API endpoints and configuration can be modified in `src/lib/api.ts`.

### Authentication
Authentication logic can be customized in `src/hooks/useAuth.ts`.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Next.js:

```bash
npm run build
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For backend integration questions, refer to [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md).

For general questions or issues, please open an issue on GitHub.
