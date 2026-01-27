const verifyOrders = async () => {
    const baseUrl = 'http://localhost:5001/api';

    try {
        // 1. Login as User (John Doe)
        console.log('--- 1. Login User (John Doe) ---');
        const userLoginRes = await fetch(`${baseUrl}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'john@example.com', password: '123456' }),
        });
        const userLoginData = await userLoginRes.json();
        const userToken = userLoginData.accessToken;
        if (userToken) console.log('✅ User Logged In');

        // 2. Login as Admin
        console.log('\n--- 2. Login Admin ---');
        const adminLoginRes = await fetch(`${baseUrl}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@example.com', password: '123456' }),
        });
        const adminLoginData = await adminLoginRes.json();
        const adminToken = adminLoginData.accessToken;
        if (adminToken) console.log('✅ Admin Logged In');

        // 3. Create Order
        console.log('\n--- 3. Create Order ---');
        const orderItems = [
            {
                name: 'Test Product',
                qty: 2,
                image: '/images/test.jpg',
                price: 50,
                product: '697898a37b05eaccc2652a57' // A valid ID but we don't strictly validate existence in controller yet? Actually we do populated commands but schema ref validation only happens if we populate.
                // Wait, I should get a real product ID first to be safe
            }
        ];

        // Fetch a real product ID first
        const productsRes = await fetch(`${baseUrl}/products`);
        const productsData = await productsRes.json();
        const productId = productsData.products[0]._id;
        orderItems[0].product = productId;

        const orderPayload = {
            orderItems,
            shippingAddress: { address: '123 St', city: 'City', postalCode: '12345', country: 'Country' },
            paymentMethod: 'PayPal',
            itemsPrice: 100,
            taxPrice: 10,
            shippingPrice: 0,
            totalPrice: 110
        };

        const createOrderRes = await fetch(`${baseUrl}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify(orderPayload)
        });
        const createOrderData = await createOrderRes.json();
        if (createOrderRes.status === 201) console.log(`✅ Order Created: ${createOrderData._id}`);
        const orderId = createOrderData._id;

        // 4. Get Order By ID
        console.log(`\n--- 4. Get Order ${orderId} ---`);
        const getOrderRes = await fetch(`${baseUrl}/orders/${orderId}`, {
            headers: { 'Authorization': `Bearer ${userToken}` }
        });
        const getOrderData = await getOrderRes.json();
        if (getOrderData._id === orderId) console.log('✅ Order Fetched');

        // 5. Pay Order
        console.log(`\n--- 5. Pay Order ${orderId} ---`);
        const payRes = await fetch(`${baseUrl}/orders/${orderId}/pay`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({
                id: 'PAYMENT_ID',
                status: 'COMPLETED',
                update_time: Date.now(),
                email_address: 'john@example.com'
            })
        });
        const payData = await payRes.json();
        if (payData.isPaid) console.log('✅ Order Paid');

        // 6. Deliver Order (Admin)
        console.log(`\n--- 6. Deliver Order ${orderId} (Admin) ---`);
        const deliverRes = await fetch(`${baseUrl}/orders/${orderId}/deliver`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${adminToken}` // Using Admin Token
            }
        }); // PUT request needs body? No, just the token
        const deliverData = await deliverRes.json();
        if (deliverData.isDelivered) console.log('✅ Order Delivered');

        // 7. Get My Orders
        console.log('\n--- 7. Get My Orders ---');
        const myOrdersRes = await fetch(`${baseUrl}/orders/myorders`, {
            headers: { 'Authorization': `Bearer ${userToken}` }
        });
        const myOrdersData = await myOrdersRes.json();
        if (myOrdersData.length > 0) console.log(`✅ Fetched ${myOrdersData.length} User Orders`);

    } catch (err) {
        console.error('Verification Failed:', err);
    }
};

verifyOrders();
