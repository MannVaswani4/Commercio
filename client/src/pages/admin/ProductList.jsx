import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Button from '../../components/Button';
import api from '../../services/api';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th,
  td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }

  th {
    background-color: #f8fafc;
    font-weight: 600;
  }

  tr:hover {
    background-color: #f1f5f9;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);

  // We can assume we might need pagination here later, but for now fetch all
  // But product controller 'getProducts' supports pagination.
  // If no params, it defaults to page 1. We might want to fetch ALL for admin list or implement pagination.
  // For simplicity, let's just use the default getProducts which returns page 1.
  // To list ALL, we might need a separate endpoint or param.
  // Let's stick to simple page 1 for now or iterate pages.
  // Actually, `getProducts` returns { products, page, pages }.

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // If we want all, we might need to modify backend to accept limit
        const { data } = await api.get('/products?pageNumber=1&keyword=');
        // Wait, default pageSize is 10. Admin might want to see more.
        // Let's assume pagination UI is out of scope for MVP admin list, just show first page.
        setProducts(data.products);
        setLoading(false);
      } catch (err) {
        toast.error(err?.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter((p) => p._id !== id));
        toast.success('Product Deleted');
      } catch (err) {
        toast.error(err?.response?.data?.message || err.message);
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        setCreateLoading(true);
        const { data } = await api.post('/products');
        setCreateLoading(false);
        toast.success('Product Created');
        navigate(`/admin/product/${data._id}/edit`);
      } catch (err) {
        setCreateLoading(false);
        toast.error(err?.response?.data?.message || err.message);
      }
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <>
      <Header>
        <h1>Products</h1>
        <Button style={{ width: 'auto' }} onClick={createProductHandler} disabled={createLoading}>
          <FaPlus /> Create Product
        </Button>
      </Header>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>PRICE</th>
            <th>CATEGORY</th>
            <th>BRAND</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product._id}</td>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.category}</td>
              <td>{product.brand}</td>
              <td>
                <Link to={`/admin/product/${product._id}/edit`} style={{ marginRight: '1rem' }}>
                  <FaEdit style={{ color: 'var(--text-color)' }} />
                </Link>
                <button
                  onClick={() => deleteHandler(product._id)}
                  style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default ProductList;
