import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { FiUser, FiMail, FiMapPin, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Button from '../components/Button';
import Input from '../components/Input';
import useAuthStore from '../store/authStore';
import api from '../services/api';

/* ─── Layout ──────────────────────────────────────────── */
const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.75rem;
`;

const CardTitle = styled.h2`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 1.25rem;
`;

/* ─── Contact card ───────────────────────────────────── */
const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-light);

  &:last-child {
    border-bottom: none;
  }
`;

const InfoIcon = styled.div`
  color: var(--text-muted);
  flex-shrink: 0;
`;

const InfoContent = styled.div`
  flex: 1;
  min-width: 0;

  .label {
    font-size: 0.7rem;
    color: var(--text-muted);
    margin-bottom: 0.1rem;
  }
  .value {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const EditBtn = styled.button`
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.15s;
  &:hover {
    color: var(--text);
  }
`;

/* ─── Address card ───────────────────────────────────── */
const AddressCard = styled.div`
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  margin-bottom: 0.75rem;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
`;

const AddressText = styled.div`
  flex: 1;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--text);
`;

const AddressActions = styled.div`
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
`;

const EmptyNote = styled.p`
  font-size: 0.85rem;
  color: var(--text-muted);
  text-align: center;
  padding: 1.5rem 0;
`;

const AddBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  background: none;
  border: 1.5px dashed var(--border);
  border-radius: var(--radius-md);
  width: 100%;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition:
    border-color 0.15s,
    color 0.15s;
  &:hover {
    border-color: var(--text-muted);
    color: var(--text);
  }
`;

/* ─── Inline edit form (name/email) ─────────────────── */
const InlineForm = styled.form`
  padding: 0.75rem 0;
`;

/* ═══════════════════════════════════════════════════════ */

const Profile = () => {
  const { userInfo, setUserInfo } = useAuthStore();

  /* contact edit state */
  const [editing, setEditing] = useState(null); // 'name' | 'email' | null
  const [nameVal, setNameVal] = useState(userInfo?.name || '');
  const [emailVal, setEmailVal] = useState(userInfo?.email || '');

  /* address form state */
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [newAddr, setNewAddr] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  /* local copy of addresses */
  const [addresses, setAddresses] = useState([]);

  /* Fetch profile to get addresses */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/profile');
        setAddresses(data.addresses || []);
      } catch {
        /* silently use empty addresses on error */
      }
    };
    fetchProfile();
  }, []);

  const saveContact = async (field) => {
    try {
      const payload = field === 'name' ? { name: nameVal } : { email: emailVal };
      const { data } = await api.put('/users/profile', payload);
      setUserInfo({ ...userInfo, ...data });
      setEditing(null);
      toast.success('Updated!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    }
  };

  const saveAddress = async () => {
    if (!newAddr.street || !newAddr.city || !newAddr.country) {
      return toast.error('Street, city and country are required');
    }
    try {
      const updated = [...addresses, newAddr];
      await api.put('/users/profile', { addresses: updated });
      setAddresses(updated);
      setNewAddr({ street: '', city: '', state: '', zipCode: '', country: '' });
      setShowAddAddr(false);
      toast.success('Address saved!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not save address');
    }
  };

  const deleteAddress = async (idx) => {
    try {
      const updated = addresses.filter((_, i) => i !== idx);
      await api.put('/users/profile', { addresses: updated });
      setAddresses(updated);
      toast.success('Address removed');
    } catch {
      toast.error('Could not remove address');
    }
  };

  return (
    <div>
      <PageTitle>My Account</PageTitle>
      <Grid>
        {/* ── Left column: contact info ── */}
        <div>
          <Card>
            <CardTitle>Contact Details</CardTitle>

            {/* Name */}
            <InfoRow>
              <InfoIcon>
                <FiUser size={16} />
              </InfoIcon>
              {editing === 'name' ? (
                <InlineForm
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveContact('name');
                  }}
                >
                  <Input
                    label=""
                    value={nameVal}
                    onChange={(e) => setNameVal(e.target.value)}
                    autoFocus
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '-0.75rem' }}>
                    <Button type="submit" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}>
                      Save
                    </Button>
                    <button
                      type="button"
                      onClick={() => setEditing(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </InlineForm>
              ) : (
                <>
                  <InfoContent>
                    <div className="label">Full name</div>
                    <div className="value">{userInfo?.name}</div>
                  </InfoContent>
                  <EditBtn onClick={() => setEditing('name')}>
                    <FiEdit2 size={14} />
                  </EditBtn>
                </>
              )}
            </InfoRow>

            {/* Email */}
            <InfoRow>
              <InfoIcon>
                <FiMail size={16} />
              </InfoIcon>
              {editing === 'email' ? (
                <InlineForm
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveContact('email');
                  }}
                >
                  <Input
                    label=""
                    type="email"
                    value={emailVal}
                    onChange={(e) => setEmailVal(e.target.value)}
                    autoFocus
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '-0.75rem' }}>
                    <Button type="submit" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}>
                      Save
                    </Button>
                    <button
                      type="button"
                      onClick={() => setEditing(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </InlineForm>
              ) : (
                <>
                  <InfoContent>
                    <div className="label">Email</div>
                    <div className="value">{userInfo?.email}</div>
                  </InfoContent>
                  <EditBtn onClick={() => setEditing('email')}>
                    <FiEdit2 size={14} />
                  </EditBtn>
                </>
              )}
            </InfoRow>
          </Card>
        </div>

        {/* ── Right column: saved addresses ── */}
        <Card>
          <CardTitle>
            <FiMapPin size={13} style={{ marginRight: '0.4rem' }} />
            Saved Addresses
          </CardTitle>

          {addresses.length === 0 && !showAddAddr && <EmptyNote>No addresses saved yet.</EmptyNote>}

          {addresses.map((addr, idx) => (
            <AddressCard key={idx}>
              <FiMapPin
                size={16}
                style={{ marginTop: '2px', color: 'var(--text-muted)', flexShrink: 0 }}
              />
              <AddressText>
                {addr.street}
                <br />
                {addr.city}
                {addr.state ? `, ${addr.state}` : ''} {addr.zipCode}
                <br />
                {addr.country}
              </AddressText>
              <AddressActions>
                <EditBtn onClick={() => deleteAddress(idx)}>
                  <FiTrash2 size={14} />
                </EditBtn>
              </AddressActions>
            </AddressCard>
          ))}

          {showAddAddr && (
            <div
              style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                marginBottom: '0.75rem',
              }}
            >
              <Input
                label="Street"
                value={newAddr.street}
                onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                placeholder="123 Main St"
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                <Input
                  label="City"
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  placeholder="City"
                />
                <Input
                  label="Postal Code"
                  value={newAddr.zipCode}
                  onChange={(e) => setNewAddr({ ...newAddr, zipCode: e.target.value })}
                  placeholder="10001"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                <Input
                  label="State"
                  value={newAddr.state}
                  onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                  placeholder="State (optional)"
                />
                <Input
                  label="Country"
                  value={newAddr.country}
                  onChange={(e) => setNewAddr({ ...newAddr, country: e.target.value })}
                  placeholder="Country"
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <Button
                  type="button"
                  onClick={saveAddress}
                  style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}
                >
                  Save Address
                </Button>
                <button
                  type="button"
                  onClick={() => setShowAddAddr(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!showAddAddr && (
            <AddBtn onClick={() => setShowAddAddr(true)}>
              <FiPlus size={15} /> Add New Address
            </AddBtn>
          )}
        </Card>
      </Grid>
    </div>
  );
};

export default Profile;
