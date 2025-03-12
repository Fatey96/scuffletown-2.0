# Deploying to Vercel - Step by Step Guide

This guide will walk you through deploying your Scuffletown 2.0 Motorsports website to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Git installed on your computer
- Your MongoDB Atlas database set up
- Your Cloudinary account configured

## Steps for Deployment

### 1. Prepare Your Environment Variables

Create a file called `.env.production` in the dealership-website directory with the following content:

```
# MongoDB Connection
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database

# NextAuth Configuration
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-key

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_SITE_NAME=Scuffletown 2.0 Motorsports
NEXT_PUBLIC_DEALER_EMAIL=contact@yourdealership.com
NEXT_PUBLIC_DEALER_PHONE=(123) 456-7890
```

Replace all placeholders with your actual credentials.

### 2. Deployment via the Vercel Web Interface

1. **Prepare your repository**:
   - Push your code to GitHub or another Git provider
   - Make sure all your code is committed and pushed

2. **Log in to Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in
   - Click "Add New" > "Project"

3. **Import your repository**:
   - Select the repository containing your dealership website
   - Configure the following settings:
     - **Framework Preset**: Next.js
     - **Root Directory**: `dealership-website` (if your repo has a nested structure)
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`
     - **Install Command**: `npm install`

4. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add all variables from your `.env.production` file
   - Make sure to mark the variables appropriately as "Production" or "Preview/Development"

5. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application

### 3. Deployment via Vercel CLI (Alternative Method)

If you prefer command line deployment:

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Log in to Vercel**:
   ```bash
   vercel login
   ```

3. **Navigate to your project directory**:
   ```bash
   cd dealership-website
   ```

4. **Deploy the project**:
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Confirm the project directory
   - Create a new project when asked
   - Accept default settings or customize as needed

5. **For production deployment**:
   ```bash
   vercel --prod
   ```

### 4. After Deployment

1. **Verify your deployment**:
   - Visit the URL provided by Vercel
   - Test all functionality, especially:
     - Contact form
     - Image uploads in admin
     - Database connections

2. **Set up your custom domain** (optional):
   - Go to your Vercel project dashboard
   - Click on "Domains"
   - Add your domain and follow the instructions for DNS setup

3. **Configure CI/CD** (optional):
   - By default, Vercel will redeploy your site when you push to your main branch
   - You can customize this in the Vercel dashboard under "Git"

## Troubleshooting

- **Build errors**: Check the logs in the Vercel dashboard for detailed information
- **API routes not working**: Make sure all environment variables are set correctly
- **Database connectivity issues**: Check if your MongoDB instance allows connections from Vercel's IP range
- **Image upload problems**: Verify your Cloudinary credentials are correct

## Additional Resources

- [Vercel Documentation for Next.js](https://vercel.com/docs/frameworks/nextjs)
- [Setting Up Environment Variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables)
- [Custom Domains in Vercel](https://vercel.com/docs/concepts/projects/domains)
- [MongoDB Atlas Connection Guide](https://www.mongodb.com/docs/atlas/connect-to-database-deployment/) 