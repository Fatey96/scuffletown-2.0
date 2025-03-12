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
  console.log(`${colors.bold}${colors.bgGreen}  Scuffletown 2.0 Motorsports GitHub Push  ${colors.reset}`);
  console.log(`${colors.bold}${colors.green}▶ ${message}${colors.reset}`);
  console.log('-'.repeat(50));
}

// Print a step
function printStep(step, message) {
  console.log(`${colors.blue}[${step}]${colors.reset} ${message}`);
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

// Check if directory is already a git repository
function isGitRepo() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Main function
async function main() {
  printHeader('Prepare GitHub Repository');

  // Step 1: Check prerequisites
  printStep(1, 'Checking prerequisites...');
  
  if (!checkGit()) {
    print('❌ Git is not installed. Please install Git before continuing.', colors.red);
    process.exit(1);
  } else {
    print('✅ Git is installed', colors.green);
  }

  // Step 2: Check if it's already a git repository
  printStep(2, 'Checking Git repository status...');
  
  let repoInitialized = isGitRepo();
  
  if (repoInitialized) {
    print('✅ Git repository already initialized', colors.green);
    
    // Check if origin is set
    try {
      const remoteUrl = execSync('git config --get remote.origin.url').toString().trim();
      print(`✅ Remote origin is set to: ${remoteUrl}`, colors.green);
    } catch (error) {
      print('⚠️ No remote origin set', colors.yellow);
      const setRemote = await question(`${colors.yellow}Do you want to set a remote origin? (y/n): ${colors.reset}`);
      
      if (setRemote.toLowerCase() === 'y') {
        const remoteUrl = await question(`${colors.cyan}Enter your GitHub repository URL: ${colors.reset}`);
        if (remoteUrl) {
          try {
            execSync(`git remote add origin ${remoteUrl}`);
            print('✅ Remote origin added', colors.green);
          } catch (error) {
            print(`❌ Failed to add remote: ${error.message}`, colors.red);
          }
        }
      }
    }
  } else {
    print('⚠️ Not a Git repository', colors.yellow);
    const initGit = await question(`${colors.yellow}Do you want to initialize a Git repository? (y/n): ${colors.reset}`);
    
    if (initGit.toLowerCase() === 'y') {
      try {
        execSync('git init');
        print('✅ Git repository initialized', colors.green);
        repoInitialized = true;
        
        // Set remote
        const remoteUrl = await question(`${colors.cyan}Enter your GitHub repository URL: ${colors.reset}`);
        if (remoteUrl) {
          try {
            execSync(`git remote add origin ${remoteUrl}`);
            print('✅ Remote origin added', colors.green);
          } catch (error) {
            print(`❌ Failed to add remote: ${error.message}`, colors.red);
          }
        }
      } catch (error) {
        print(`❌ Failed to initialize Git repository: ${error.message}`, colors.red);
        process.exit(1);
      }
    } else {
      print('Exiting as Git repository is required for GitHub deployment.', colors.yellow);
      process.exit(0);
    }
  }

  if (!repoInitialized) {
    print('Cannot continue without a Git repository.', colors.red);
    process.exit(1);
  }

  // Step 3: Check for .gitignore
  printStep(3, 'Checking .gitignore...');
  
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  
  if (!fs.existsSync(gitignorePath)) {
    print('⚠️ No .gitignore file found', colors.yellow);
    const createGitignore = await question(`${colors.yellow}Do you want to create a .gitignore file? (y/n): ${colors.reset}`);
    
    if (createGitignore.toLowerCase() === 'y') {
      const gitignoreContent = `# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Next.js
.next/
out/
.vercel

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build files
build/
dist/

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Misc
.DS_Store
*.pem
coverage/
.coverage
.nyc_output

# IDE
.idea/
.vscode/
*.swp
*.swo
`;
      
      fs.writeFileSync(gitignorePath, gitignoreContent);
      print('✅ .gitignore file created', colors.green);
    }
  } else {
    print('✅ .gitignore file exists', colors.green);
  }

  // Step 4: Commit changes
  printStep(4, 'Preparing to commit changes...');
  
  // Show status
  try {
    const status = execSync('git status --porcelain').toString();
    
    if (status.trim() === '') {
      print('No changes to commit', colors.yellow);
    } else {
      print('Files to be committed:', colors.cyan);
      console.log(execSync('git status').toString());
      
      const commitChanges = await question(`${colors.yellow}Do you want to commit these changes? (y/n): ${colors.reset}`);
      
      if (commitChanges.toLowerCase() === 'y') {
        // Add files
        execSync('git add .');
        print('✅ Files added to staging area', colors.green);
        
        // Commit
        const commitMessage = await question(`${colors.cyan}Enter commit message: ${colors.reset}`);
        execSync(`git commit -m "${commitMessage || 'Update Scuffletown 2.0 Motorsports website'}"`);
        print('✅ Changes committed', colors.green);
      }
    }
  } catch (error) {
    print(`❌ Error checking Git status: ${error.message}`, colors.red);
  }

  // Step 5: Push to GitHub
  printStep(5, 'Pushing to GitHub...');
  
  const pushToGitHub = await question(`${colors.yellow}Do you want to push to GitHub now? (y/n): ${colors.reset}`);
  
  if (pushToGitHub.toLowerCase() === 'y') {
    try {
      // Check current branch
      const currentBranch = execSync('git branch --show-current').toString().trim();
      print(`Current branch: ${currentBranch}`, colors.cyan);
      
      // Push
      try {
        print('Pushing to GitHub...', colors.cyan);
        execSync(`git push -u origin ${currentBranch}`);
        print('✅ Successfully pushed to GitHub', colors.green);
      } catch (error) {
        if (error.message.includes('remote contains work that you do')) {
          print('⚠️ Remote branch has changes that need to be pulled first', colors.yellow);
          const pullFirst = await question(`${colors.yellow}Do you want to pull changes first? (y/n): ${colors.reset}`);
          
          if (pullFirst.toLowerCase() === 'y') {
            try {
              execSync(`git pull origin ${currentBranch}`);
              print('✅ Successfully pulled changes', colors.green);
              
              // Try pushing again
              execSync(`git push -u origin ${currentBranch}`);
              print('✅ Successfully pushed to GitHub', colors.green);
            } catch (error) {
              print(`❌ Error pulling changes: ${error.message}`, colors.red);
            }
          }
        } else {
          print(`❌ Error pushing to GitHub: ${error.message}`, colors.red);
        }
      }
    } catch (error) {
      print(`❌ Error determining current branch: ${error.message}`, colors.red);
    }
  }

  // Final instructions
  printHeader('Next Steps');
  print('Your code is now on GitHub! Next steps:', colors.cyan);
  print('1. Go to Vercel and import your GitHub repository', colors.cyan);
  print('2. Follow the deployment steps in VERCEL_DEPLOYMENT.md', colors.cyan);
  print('3. Set up your environment variables in the Vercel dashboard', colors.cyan);
  
  rl.close();
}

// Run the script
main().catch(error => {
  print(`Error: ${error.message}`, colors.red);
  rl.close();
  process.exit(1);
}); 