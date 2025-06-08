// test.js - Simple test script for EAUT Assessment Platform

const http = require('http');
const fs = require('fs');

// Test configuration
const config = {
  host: 'localhost',
  port: 3000,
  timeout: 5000
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Test results
let testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

// Utility functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logPass(test) {
  testResults.passed++;
  testResults.total++;
  log(`✅ PASS: ${test}`, 'green');
}

function logFail(test, error) {
  testResults.failed++;
  testResults.total++;
  log(`❌ FAIL: ${test}`, 'red');
  log(`   Error: ${error}`, 'red');
}

// HTTP request helper
function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(config.timeout, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

// Test functions
async function testServerRunning() {
  try {
    const response = await makeRequest({
      hostname: config.host,
      port: config.port,
      path: '/api/health',
      method: 'GET'
    });

    if (response.statusCode === 200) {
      logPass('Server is running');
      return true;
    } else {
      logFail('Server health check', `Expected status 200, got ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    logFail('Server connection', error.message);
    return false;
  }
}

async function testStaticFiles() {
  try {
    const response = await makeRequest({
      hostname: config.host,
      port: config.port,
      path: '/',
      method: 'GET'
    });

    if (response.statusCode === 200 && response.data.includes('EAUT Assessment')) {
      logPass('Static files served correctly');
      return true;
    } else {
      logFail('Static files', 'Homepage not loading correctly');
      return false;
    }
  } catch (error) {
    logFail('Static files', error.message);
    return false;
  }
}

async function testLoginEndpoint() {
  try {
    const response = await makeRequest({
      hostname: config.host,
      port: config.port,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'password'
      })
    });

    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      if (data.success && data.data && data.data.token) {
        logPass('Login endpoint works');
        return data.data.token;
      } else {
        logFail('Login endpoint', 'Invalid response format');
        return null;
      }
    } else {
      logFail('Login endpoint', `Expected status 200, got ${response.statusCode}`);
      return null;
    }
  } catch (error) {
    logFail('Login endpoint', error.message);
    return null;
  }
}

async function testProtectedEndpoint(token) {
  try {
    const response = await makeRequest({
      hostname: config.host,
      port: config.port,
      path: '/api/programs',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.statusCode === 200) {
      logPass('Protected endpoint with valid token');
      return true;
    } else {
      logFail('Protected endpoint', `Expected status 200, got ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    logFail('Protected endpoint', error.message);
    return false;
  }
}

async function testUnauthorizedAccess() {
  try {
    const response = await makeRequest({
      hostname: config.host,
      port: config.port,
      path: '/api/programs',
      method: 'GET'
    });

    if (response.statusCode === 401) {
      logPass('Unauthorized access properly blocked');
      return true;
    } else {
      logFail('Authorization', `Expected status 401, got ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    logFail('Authorization test', error.message);
    return false;
  }
}

async function testFileStructure() {
  const requiredFiles = [
    'server.js',
    'package.json',
    'index.html',
    'main.js',
    'styles.css',
    'schema.sql',
    '.env'
  ];

  let allFilesExist = true;

  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      logPass(`Required file exists: ${file}`);
    } else {
      logFail('File structure', `Missing required file: ${file}`);
      allFilesExist = false;
    }
  }

  return allFilesExist;
}

// Main test runner
async function runTests() {
  log('🧪 Running EAUT Assessment Platform Tests', 'blue');
  log('='.repeat(50), 'blue');

  // Test file structure first
  log('\n📁 Testing file structure...', 'yellow');
  await testFileStructure();

  // Test server connectivity
  log('\n🌐 Testing server connectivity...', 'yellow');
  const serverRunning = await testServerRunning();

  if (!serverRunning) {
    log('\n❌ Server is not running. Please start the server first with: npm start', 'red');
    return;
  }

  // Test static files
  log('\n📄 Testing static file serving...', 'yellow');
  await testStaticFiles();

  // Test authentication
  log('\n🔐 Testing authentication...', 'yellow');
  await testUnauthorizedAccess();
  const token = await testLoginEndpoint();

  // Test protected endpoints
  if (token) {
    log('\n🛡️  Testing protected endpoints...', 'yellow');
    await testProtectedEndpoint(token);
  }

  // Print results
  log('\n' + '='.repeat(50), 'blue');
  log('📊 Test Results:', 'blue');
  log(`   Total: ${testResults.total}`, 'blue');
  log(`   Passed: ${testResults.passed}`, 'green');
  log(`   Failed: ${testResults.failed}`, testResults.failed > 0 ? 'red' : 'green');
  
  const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
  log(`   Success Rate: ${successRate}%`, successRate === '100.0' ? 'green' : 'yellow');

  if (testResults.failed === 0) {
    log('\n🎉 All tests passed! The system is ready to use.', 'green');
  } else {
    log('\n⚠️  Some tests failed. Please check the errors above.', 'yellow');
  }
}

// Run the tests
runTests().catch((error) => {
  log(`Fatal error running tests: ${error.message}`, 'red');
  process.exit(1);
});
