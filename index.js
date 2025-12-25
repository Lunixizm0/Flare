const { systeminfolib } = require('./utils/systeminfolib');

async function main() {
  try {
    console.log('Flare Data Collector Initialized.');
    await Promise.all([
      systeminfolib()
    ]);
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    process.exit(1);
  }
}

main();