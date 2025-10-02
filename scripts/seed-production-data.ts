import 'dotenv/config';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function seedProductionData() {
  try {
    console.log('🌱 Seeding production GND data...');
    
    const command = `mysql -h ${process.env.DB_HOST} -u ${process.env.DB_USERNAME} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} < seed-gnd-data.sql`;
    
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr) {
      console.warn('Warning:', stderr);
    }
    console.log('Output:', stdout);
    
  } catch (error) {
    console.error('❌ Failed to seed GND data:', error);
    process.exit(1);
  }
}

// Only run if this script is executed directly
if (require.main === module) {
  seedProductionData();
}

export { seedProductionData };