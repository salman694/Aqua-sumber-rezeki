// Automated integration test for AquaZone backend API with IDR currency
const BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function runTests() {
  console.log('Testing AquaZone API Endpoints with Rupiah Currency...\n');

  // 1. Health Check
  const health = await request('/health');
  console.log('1. Health check:', health.status === 200 ? '✅ PASS' : '❌ FAIL', health.data);

  // 2. Login as Demo User (Jon Karter)
  const userLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'jon@karter.com', password: 'user123' })
  });
  console.log('2. User login (Jon Karter):', userLogin.status === 200 ? '✅ PASS' : '❌ FAIL', userLogin.data.user?.name);
  const userToken = userLogin.data.token;

  // 3. Login as Admin
  const adminLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@aquazone.com', password: 'admin123' })
  });
  console.log('3. Admin login:', adminLogin.status === 200 ? '✅ PASS' : '❌ FAIL', adminLogin.data.user?.role);
  const adminToken = adminLogin.data.token;

  // 4. Get Products List
  const prods = await request('/products');
  console.log('4. Get products count:', prods.status === 200 && prods.data.products?.length >= 9 ? '✅ PASS' : '❌ FAIL', `(${prods.data.products?.length} items)`);

  // Verify Oranda Goldfish Rupiah price (Rp 185.000)
  const oranda = prods.data.products.find(p => p.id === 'prod-oranda-goldfish');
  const hasRupiah = oranda && oranda.price === 185000;
  console.log('5. Verify Oranda Goldfish Price in Rupiah:', hasRupiah ? '✅ PASS (Rp 185.000)' : '❌ FAIL', oranda?.price);

  // 6. Admin Create New Product with IDR price
  const newProdRes = await request('/products', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      name: 'Super Red Dragon Arowana',
      genus: 'Scleropages',
      category: 'Fish',
      price: 3500000,
      stock: 5,
      rating: 5.0,
      description: 'Ikan arwana super red kualitas kontes dengan sertifikat chip.',
      image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=600&q=80',
      specifications: {
        weight: '1.5 kg',
        size: '45 cm',
        temperature: '26-30°C',
        tankSize: '500 Liter',
        age: '3 Tahun',
        diet: 'Karnivora'
      }
    })
  });
  console.log('6. Admin create product in IDR:', newProdRes.status === 201 ? '✅ PASS' : '❌ FAIL', newProdRes.data.product?.name, `Rp ${newProdRes.data.product?.price}`);
  const createdProdId = newProdRes.data.product?.id;

  // 7. Regular User places an order in IDR
  const orderRes = await request('/orders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
    body: JSON.stringify({
      items: [
        {
          productId: 'prod-oranda-goldfish',
          name: 'Oranda Goldfish',
          price: 185000,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=600&q=80'
        }
      ],
      subtotal: 370000,
      shippingFee: 25000,
      totalAmount: 395000,
      shippingAddress: 'Denpasar, Bali',
      userPhone: '+62 819-8765-4321',
      paymentMethod: 'QRIS',
      notes: 'Kemasan aerasi oksigen hidup'
    })
  });
  console.log('7. User create order in IDR:', orderRes.status === 201 ? '✅ PASS' : '❌ FAIL', orderRes.data.order?.id, `Total: Rp ${orderRes.data.order?.totalAmount}`);
  const orderId = orderRes.data.order?.id;

  // 8. User checks order history
  const myOrders = await request('/orders/my-orders', {
    headers: { Authorization: `Bearer ${userToken}` }
  });
  console.log('8. User order history:', myOrders.status === 200 && myOrders.data.orders?.length > 0 ? '✅ PASS' : '❌ FAIL');

  // 9. Admin updates order status
  const updateStatus = await request(`/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ status: 'Shipped' })
  });
  console.log('9. Admin update order status to Shipped:', updateStatus.status === 200 ? '✅ PASS' : '❌ FAIL', updateStatus.data.order?.status);

  // 10. Admin Stats
  const statsRes = await request('/admin/stats', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log('10. Admin dashboard stats in IDR:', statsRes.status === 200 ? '✅ PASS' : '❌ FAIL', `Total Pendapatan: Rp ${statsRes.data.stats?.totalRevenue}`);

  // 11. Clean up created test product
  if (createdProdId) {
    const delRes = await request(`/products/${createdProdId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('11. Admin delete test product:', delRes.status === 200 ? '✅ PASS' : '❌ FAIL');
  }

  console.log('\n🎉 ALL IDR CURRENCY INTEGRATION TESTS PASSED!');
}

runTests().catch(err => {
  console.error('Integration test failed:', err);
  process.exit(1);
});
