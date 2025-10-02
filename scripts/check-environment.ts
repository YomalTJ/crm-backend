import 'dotenv/config';

function checkEnvironment() {
  console.log('🔍 Checking environment configuration...\n');

  const requiredVars = [
    'DB_HOST',
    'DB_PORT',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_NAME',
  ];

  const optionalVars = ['PORT', 'JWT_SECRET', 'NODE_ENV'];

  let hasErrors = false;

  console.log('Required Variables:');
  console.log('------------------');
  requiredVars.forEach((varName) => {
    const value = process.env[varName];
    if (!value) {
      console.log(`❌ ${varName}: NOT SET`);
      hasErrors = true;
    } else {
      // Mask sensitive values
      const displayValue =
        varName.includes('PASSWORD') || varName.includes('SECRET')
          ? '********'
          : value;
      console.log(`✅ ${varName}: ${displayValue}`);
    }
  });

  console.log('\nOptional Variables:');
  console.log('------------------');
  optionalVars.forEach((varName) => {
    const value = process.env[varName];
    if (!value) {
      console.log(`⚠️  ${varName}: not set (will use default)`);
    } else {
      const displayValue =
        varName.includes('PASSWORD') || varName.includes('SECRET')
          ? '********'
          : value;
      console.log(`✅ ${varName}: ${displayValue}`);
    }
  });

  if (hasErrors) {
    console.log('\n❌ Environment check failed!');
    console.log(
      'Please ensure all required variables are set in your .env file',
    );
    process.exit(1);
  } else {
    console.log('\n✅ Environment configuration is valid!');
    process.exit(0);
  }
}

checkEnvironment();
