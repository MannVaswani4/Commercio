const verifyProducts = async () => {
    const baseUrl = 'http://localhost:5001/api';

    try {
        // 1. Login as Admin
        console.log('--- 1. Login Admin ---');
        const loginRes = await fetch(`${baseUrl}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@example.com', password: '123456' }),
        });
        // Wait, seeder uses: password: bcrypt.hashSync('123456', 10)
        // So password is '123456'

        const loginData = await loginRes.json();
        if (loginData.accessToken) console.log('✅ Admin Logged In');
        const token = loginData.accessToken;

        // 2. Get Products
        console.log('\n--- 2. Get All Products ---');
        const productsRes = await fetch(`${baseUrl}/products`);
        const productsData = await productsRes.json();
        console.log(`✅ Fetched ${productsData.products.length} products`);
        const firstProductId = productsData.products[0]._id;

        // 3. Get Single Product
        console.log(`\n--- 3. Get Product ${firstProductId} ---`);
        const productRes = await fetch(`${baseUrl}/products/${firstProductId}`);
        const productData = await productRes.json();
        if (productData.name) console.log(`✅ Fetched: ${productData.name}`);

        // 4. Create Product (Admin)
        console.log('\n--- 4. Create Product (Admin) ---');
        const createRes = await fetch(`${baseUrl}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({})
        });
        const createData = await createRes.json();
        console.log('Status:', createRes.status);
        if (createRes.status === 201) console.log(`✅ Created Product: ${createData.name}`);
        const newProductId = createData._id;

        // 5. Update Product
        console.log(`\n--- 5. Update Product ${newProductId} ---`);
        const updateRes = await fetch(`${baseUrl}/products/${newProductId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: 'Updated Name',
                price: 100,
                brand: 'New Brand',
                category: 'New Category',
                countInStock: 10,
                description: 'New Description',
                image: '/images/new.jpg'
            })
        });
        const updateData = await updateRes.json();
        if (updateData.name === 'Updated Name') console.log('✅ Product Updated');

        // 6. Delete Product
        console.log(`\n--- 6. Delete Product ${newProductId} ---`);
        const deleteRes = await fetch(`${baseUrl}/products/${newProductId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const deleteData = await deleteRes.json();
        if (deleteData.message === 'Product removed') console.log('✅ Product Deleted');

    } catch (err) {
        console.error('Verification Failed:', err);
    }
};

verifyProducts();
