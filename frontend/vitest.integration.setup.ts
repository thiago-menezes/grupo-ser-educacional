import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { MockServer } from '@/libs/mock';

const execAsync = promisify(exec);

let mockServer: MockServer | undefined;

export async function setup() {
  console.log('Starting mock server for integration tests...');

  try {
    // Kill any existing prism processes first
    try {
      await execAsync('pkill -f "prism mock.*4010" || true');
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error killing existing prism processes:', error);
      // Ignore errors
    }

    // Use the new MockServer class
    mockServer = new MockServer({
      port: 4010,
      specPath: 'public/openapi.yaml',
      cors: true,
    });

    await mockServer.start();

    // Test if server is running with retry logic
    let serverReady = false;
    for (let i = 0; i < 10; i++) {
      try {
        const response = await fetch('http://localhost:4010');
        if (response.status < 500) {
          serverReady = true;
          console.log('Mock server started successfully on port 4010');
          break;
        }
      } catch (error) {
        console.error('Error checking if server is ready:', error);
        // Server not ready yet, wait and retry
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    if (!serverReady) {
      console.warn('Mock server may not be fully ready, but continuing...');
    }
  } catch (error) {
    console.error('Failed to start mock server:', error);
    throw error;
  }
}

export async function teardown() {
  console.log('Stopping mock server...');

  if (mockServer) {
    await mockServer.stop();
    mockServer = undefined;
  }

  // Kill any remaining prism processes on port 4010 (fallback)
  try {
    await execAsync('pkill -f "prism mock.*4010" || true');
  } catch (error) {
    console.error('Error killing remaining prism processes:', error);
    // Ignore errors - process might not exist
  }

  console.log('Mock server stopped');
}
