const verifyAuth = async () => {
    const baseUrl = 'http://localhost:5001/api/users';
    const user = {
        name: 'Test Verifier',
        email: `verifier${Date.now()}@test.com`,
        password: 'password123',
    };

    try {
        console.log('--- 1. Testing Registration ---');
        const regRes = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:5173'
            },
            body: JSON.stringify(user),
        });
        const text = await regRes.text();
        console.log('Raw Response:', text);
        try {
            const regData = JSON.parse(text);
            if (regData.accessToken) console.log('✅ Access Token Received');
        } catch (e) {
            console.log('Failed to parse JSON');
        }

        console.log('\n--- 2. Testing Login ---');
        const loginRes = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, password: user.password }),
        });
        const loginData = await loginRes.json();
        console.log('Status:', loginRes.status);
        if (loginData.accessToken) console.log('✅ Access Token Received');

        // Check if cookie is set (Note: fetch in node doesn't store cookies by default but we can see headers)
        const setCookie = loginRes.headers.get('set-cookie');
        if (setCookie) console.log('✅ Set-Cookie Header Present:', setCookie.split(';')[0]);

        console.log('\n--- 3. Testing Protected Route (Profile) ---');
        const profileRes = await fetch(`${baseUrl}/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${loginData.accessToken}`
            }
        });
        const profileData = await profileRes.json();
        console.log('Status:', profileRes.status);
        if (profileData.email === user.email) console.log('✅ Profile Data Verified');

        console.log('\n--- 4. Testing Logout ---');
        const logoutRes = await fetch(`${baseUrl}/logout`, {
            method: 'POST'
        });
        console.log('Status:', logoutRes.status);
        const logoutCookie = logoutRes.headers.get('set-cookie');
        if (logoutCookie) console.log('✅ Cookie Cleared');

    } catch (err) {
        console.error('Verification Failed:', err);
    }
};

verifyAuth();
