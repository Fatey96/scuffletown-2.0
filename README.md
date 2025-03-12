# Auto Dealer Website

A modern, responsive website for a car and motorcycle dealership built with Next.js and Tailwind CSS.

## Features

- 🚗 Modern, responsive design with red color theme
- 🏎️ Vehicle inventory management with filtering and sorting
- 🔐 Admin access for inventory management
- 🗺️ Interactive location map
- 📝 Contact form for customer inquiries
- ⭐ Customer reviews section
- 💰 Financing pre-qualification integration
- 📱 Mobile-friendly interface

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Deployment**: Vercel
- **Maps**: Google Maps API
- **Forms**: React Hook Form

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn
- MongoDB database (local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dealership-website.git
   cd dealership-website
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   # MongoDB Connection
   MONGODB_URI=your_mongodb_connection_string_here

   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_here

   # Google Maps API Key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

   # Cloudinary Configuration (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Email Service (for contact form)
   EMAIL_SERVICE=your_email_service # e.g., gmail
   EMAIL_USERNAME=your_email_username
   EMAIL_PASSWORD=your_email_password
   EMAIL_FROM=your_email_from_address
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

## Project Structure

```
dealership-website/
├── components/         # React components
│   ├── admin/          # Admin-related components
│   ├── contact/        # Contact form components
│   ├── inventory/      # Vehicle inventory components
│   ├── layout/         # Layout components (Header, Footer)
│   ├── maps/           # Map components
│   └── reviews/        # Review components
├── models/             # MongoDB models
├── pages/              # Next.js pages
│   ├── api/            # API routes
│   ├── admin/          # Admin pages
│   ├── inventory/      # Inventory pages
│   └── ...             # Other pages
├── public/             # Static assets
├── styles/             # Global styles
├── utils/              # Utility functions
└── hooks/              # Custom React hooks
```

## Deployment on Vercel

This website is optimized for deployment on Vercel, the platform built by the creators of Next.js.

### Prerequisites

- A Vercel account
- MongoDB database (MongoDB Atlas recommended)
- Cloudinary account (for image upload)
- Git (for version control)

### Deployment Steps

#### 1. Prepare Your Environment Variables

All necessary environment variables are documented in `.env.example`. Make sure you have set up:

- MongoDB connection string
- NextAuth secret
- Cloudinary API credentials
- Site configuration values

#### 2. Using the Helper Script (Recommended)

We've included a deployment helper script that simplifies the process:

```bash
# Navigate to the project directory
cd dealership-website

# Run the deployment helper
node deploy-to-vercel.js
```

The script will:
- Check prerequisites
- Verify your build compiles
- Log you into Vercel if needed
- Guide you through the deployment process

#### 3. Manual Deployment

If you prefer to deploy manually:

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the project:
   ```bash
   vercel
   ```

4. For production deployments:
   ```bash
   vercel --prod
   ```

#### 4. Environment Variables in Vercel Dashboard

After initial deployment:

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add all required environment variables from your `.env.local` file

#### 5. MongoDB Connection

Ensure your MongoDB connection string in the Vercel environment variables uses:
- IP whitelisting that includes Vercel's IP ranges (or 0.0.0.0/0 for testing)
- A database user with the appropriate permissions

#### 6. Custom Domain (Optional)

Configure your custom domain in the Vercel dashboard under the "Domains" section.

## Admin Access

To access the admin panel:

1. Create an admin user in your MongoDB database
2. Navigate to `/admin/login`
3. Login with your admin credentials

## Customization

### Changing Colors

The primary color scheme is defined in `tailwind.config.js`. You can modify the colors there:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#e31c25', // Red color theme
        dark: '#b51219',
        light: '#ff3c45',
      },
      // ...other colors
    },
  },
},
```

### Adding New Pages

Create new pages in the `pages` directory. Next.js will automatically create routes based on the file structure.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [MongoDB](https://www.mongodb.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Vercel](https://vercel.com/)
