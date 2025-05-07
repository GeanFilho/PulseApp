# Pulse - Employee Feedback System

![Pulse Logo](https://via.placeholder.com/150x50?text=Pulse)

Pulse is a comprehensive employee feedback and organizational climate monitoring system that helps companies track team motivation, workload, and overall satisfaction through weekly assessments.

## Features

- **Weekly Employee Feedback**: Simple forms to collect employee sentiment
- **Admin Analytics Dashboard**: Visualize team health metrics
- **User Management**: Manage departments and users
- **Data Export**: Generate reports in PDF or Excel format
- **Responsive Design**: Works on mobile and desktop devices

## Tech Stack

- React 19
- Chart.js for data visualization
- PostgreSQL database
- JWT authentication
- jsPDF & XLSX for data export

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- PostgreSQL (if you want to run the full backend)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pulse-app.git
   cd pulse-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit the `.env` file with your configuration.

4. Run the mock API server:
   ```bash
   npm run mock-api
   ```

5. In a new terminal, start the React development server:
   ```bash
   npm start
   ```

6. The application will open in your browser at `http://localhost:3000`

### Database Setup

For running with a real PostgreSQL database:

1. Create a PostgreSQL database
2. Run the migration scripts located in `migrations/` folder:
   ```bash
   psql -U your_username -d your_database_name -f migrations/001_create_initial_tables.sql
   ```

## Running in Production

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Authentication

The system comes with default users:

- **Admin User**: 
  - Email: admin@exemplo.com
  - Password: senha123

- **Regular User**: 
  - Email: usuario@exemplo.com 
  - Password: senha123

## Folder Structure

```
pulse-app/
├── migrations/           # Database migration scripts
├── mock-api/             # Mock API for development
├── public/               # Static files
├── src/
│   ├── components/       # React components
│   ├── contexts/         # React contexts (auth, etc.)
│   ├── pages/            # Page components
│   ├── services/         # API services
│   └── styles/           # CSS and styling
└── package.json
```

## Customization

### Departments

Edit the departments list in:
- `src/pages/admin/Settings.js` for admin settings
- `src/pages/auth/Register.js` for registration options

### Branding

To customize the app name and branding:
1. Change the company name in the admin settings
2. Replace logo and colors in `src/styles/theme.js`

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Create React App team for the development environment
* All contributors and beta testers
