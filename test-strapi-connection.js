// Test BFF endpoint
async function testBFFEndpoint() {
  console.log('🔍 Testing BFF /api/institutions endpoint...\n');

  try {
    const response = await fetch('http://localhost:3000/api/institutions?slug=unama');

    console.log('Status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
      return;
    }

    const data = await response.json();
    console.log('✅ Success!');
    console.log('Data:', JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testBFFEndpoint();
