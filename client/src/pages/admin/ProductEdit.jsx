import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormContainer from '../../components/FormContainer';
import Button from '../../components/Button';
import Input from '../../components/Input';
import api from '../../services/api';

const ProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setName(data.name);
                setPrice(data.price);
                setImage(data.image);
                setBrand(data.brand);
                setCategory(data.category);
                setCountInStock(data.countInStock);
                setDescription(data.description);
            } catch (err) {
                toast.error(err?.response?.data?.message || err.message);
            }
        };

        fetchProduct();
    }, [id]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const { data } = await api.post('/upload', formData, config);
            setImage(data);
        } catch {
            console.error('Upload failed');
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/products/${id}`, {
                name,
                price,
                image,
                brand,
                category,
                description,
                countInStock,
            });
            toast.success('Product Updated');
            navigate('/admin/productlist');
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message);
        }
    };

    return (
        <FormContainer title="Edit Product">
            <Link to="/admin/productlist" style={{ marginBottom: '1rem', display: 'block' }}>Go Back</Link>
            <form onSubmit={submitHandler}>
                <Input
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Input
                    label="Price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                />
                <Input
                    label="Image"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                />
                <input
                    type="file"
                    onChange={uploadFileHandler}
                    style={{ marginBottom: '1rem' }}
                />

                <Input
                    label="Brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                />
                <Input
                    label="Count In Stock"
                    type="number"
                    value={countInStock}
                    onChange={(e) => setCountInStock(Number(e.target.value))}
                />
                <Input
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                <Input
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <Button type="submit">Update</Button>
            </form>
        </FormContainer>
    );
};

export default ProductEdit;
