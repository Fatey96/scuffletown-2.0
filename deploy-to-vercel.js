#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ANSI color codes for prettier output
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
};

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to ask questions
function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

// Print with color
function print(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Print a section header
function printHeader(message) {
  console.log('\n');
  console.log(`${colors.bold}${colors.bgGreen}  Scuffletown 2.0 Motorsports Deployment  ${colors.reset}`);
  console.log(`${colors.bold}${colors.green}▶ ${message}${colors.reset}`);
  console.log('-'.repeat(50));
}

// Print a step
function printStep(step, message) {
  console.log(`${colors.blue}[${step}]${colors.reset} ${message}`);
}

// Check if Vercel CLI is installed
function checkVercelCLI() {
  try {
    execSync('vercel --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Check if git is installed
function checkGit() {
  try {
    execSync('git --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Check if .env.local exists
function checkEnvFile() {
  return fs.existsSync(path.join(process.cwd(), '.env.local'));
}

// Main deployment function
async function deploy() {
  printHeader('Vercel Deployment Preparation');

  // Step 1: Check prerequisites
  printStep(1, 'Checking prerequisites...');
  
  if (!checkVercelCLI()) {
    print('❌ Vercel CLI is not installed. Installing...', colors.yellow);
    try {
      execSync('npm install -g vercel', { stdio: 'inherit' });
      print('✅ Vercel CLI installed successfully', colors.green);
    } catch (error) {
      print('❌ Failed to install Vercel CLI. Please install manually with: npm install -g vercel', colors.red);
      process.exit(1);
    }
  } else {
    print('✅ Vercel CLI is installed', colors.green);
  }

  if (!checkGit()) {
    print('❌ Git is not installed. Please install Git before continuing.', colors.red);
    process.exit(1);
  } else {
    print('✅ Git is installed', colors.green);
  }

  if (!checkEnvFile()) {
    print('⚠️ No .env.local file found. You will need to set up environment variables on Vercel manually.', colors.yellow);
  } else {
    print('✅ .env.local file found', colors.green);
  }

  // Step 2: Build the project to verify it works
  printStep(2, 'Building project to verify it compiles...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    print('✅ Build successful', colors.green);
  } catch (error) {
    print('❌ Build failed. Please fix the errors before deploying.', colors.red);
    process.exit(1);
  }

  // Step 3: Confirm deployment
  printStep(3, 'Preparing for deployment...');
  const deployConfirm = await question(`${colors.yellow}Do you want to deploy to Vercel now? (y/n): ${colors.reset}`);
  
  if (deployConfirm.toLowerCase() !== 'y') {
    print('Deployment cancelled by user.', colors.yellow);
    rl.close();
    return;
  }

  // Step 4: Login to Vercel if needed
  printStep(4, 'Logging in to Vercel...');
  try {
    print('If you\'re not logged in, a browser window will open for authentication.', colors.cyan);
    execSync('vercel whoami', { stdio: 'ignore' });
    print('✅ Already logged in to Vercel', colors.green);
  } catch (error) {
    print('Please log in to Vercel:', colors.cyan);
    execSync('vercel login', { stdio: 'inherit' });
  }

  // Step 5: Deploy to Vercel
  printStep(5, 'Deploying to Vercel...');
  print('This will start the deployment process...', colors.cyan);
  
  try {
    execSync('vercel --yes', { stdio: 'inherit' });
    print('✅ Deployment initiated! Follow the instructions in the terminal.', colors.green);
  } catch (error) {
    print(`❌ Deployment failed: ${error.message}`, colors.red);
    process.exit(1);
  }

  // Final instructions
  printHeader('Next Steps');
  print('After deployment is complete:', colors.cyan);
  print('1. Set up your environment variables in the Vercel dashboard', colors.cyan);
  print('2. Configure your custom domain if needed', colors.cyan);
  print('3. To make future deployments easier, you can run:', colors.cyan);
  print('   vercel --prod', colors.dim);
  
  rl.close();
}

// Run the deployment
deploy().catch(error => {
  print(`Error: ${error.message}`, colors.red);
  rl.close();
  process.exit(1);
}); 