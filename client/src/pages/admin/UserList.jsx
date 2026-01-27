import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaTimes, FaCheck, FaTrash, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Button from '../../components/Button';
import api from '../../services/api';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th, td {
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

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await api.get('/users');
                setUsers(data);
                setLoading(false);
            } catch (err) {
                toast.error(err?.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/users/${id}`);
                setUsers(users.filter(user => user._id !== id));
                toast.success('User Deleted');
            } catch (err) {
                toast.error(err?.response?.data?.message || err.message);
            }
        }
    }

    if (loading) return <h2>Loading...</h2>;

    return (
        <>
            <h1>Users</h1>
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>EMAIL</th>
                        <th>ADMIN</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                            <td>
                                {user.role === 'admin' ? (
                                    <FaCheck style={{ color: 'green' }} />
                                ) : (
                                    <FaTimes style={{ color: 'red' }} />
                                )}
                            </td>
                            <td>
                                {user.role !== 'admin' && (
                                    <button
                                        onClick={() => deleteHandler(user._id)}
                                        style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
};

export default UserList;
