import React from 'react';
import toast from 'react-hot-toast';
import { APP_CONSTANTS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

const defaultUserForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  role: 'user'
};

const UserManagement = ({ users = [], onCreateUser, onUpdateUser, onDeleteUser }) => {
  const [form, setForm] = React.useState(defaultUserForm);
  const [editingId, setEditingId] = React.useState(null);

  const startEdit = (user) => {
    setEditingId(user._id);
    setForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      password: '',
      phone: user.phone || '',
      role: user.role || 'user'
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(defaultUserForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = { ...form };

    if (!payload.password) {
      delete payload.password;
    }

    try {
      if (editingId) {
        await onUpdateUser(editingId, payload);
        toast.success('User updated');
      } else {
        await onCreateUser(payload);
        toast.success('User created');
      }
      resetForm();
    } catch (error) {
      toast.error(error?.message || 'Action failed');
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-black/40">User management</p>
          <h3 className="mt-2 text-2xl font-semibold text-black">{editingId ? 'Edit user' : 'Invite user'}</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input className="rounded-2xl border px-4 py-3" placeholder="First name" value={form.firstName} onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))} />
          <input className="rounded-2xl border px-4 py-3" placeholder="Last name" value={form.lastName} onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))} />
          <input className="rounded-2xl border px-4 py-3 md:col-span-2" placeholder="Email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
          <input className="rounded-2xl border px-4 py-3 md:col-span-2" placeholder={editingId ? 'Password (optional)' : 'Password'} type="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
          <input className="rounded-2xl border px-4 py-3 md:col-span-2" placeholder="Phone" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
          <select className="rounded-2xl border px-4 py-3 md:col-span-2" value={form.role} onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="rounded-full bg-black px-5 py-3 font-semibold text-white">{editingId ? 'Update user' : 'Create user'}</button>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded-full border border-black/10 px-5 py-3 font-semibold text-black">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4 rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-black/40">Admin users</p>
            <h3 className="mt-2 text-2xl font-semibold text-black">Users</h3>
          </div>
          <div className="rounded-full bg-black/5 px-4 py-2 text-sm font-semibold text-black/60">{users.length} total</div>
        </div>

        <div className="space-y-3">
          {users.map((user) => (
            <article key={user._id} className="rounded-[24px] border border-black/5 bg-[linear-gradient(180deg,#fff_0%,#fbfbfb_100%)] p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-black">{user.firstName} {user.lastName}</h4>
                  <p className="text-sm text-black/55">{user.email}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-black/35">{user.role} · {user.isActive ? 'Active' : 'Inactive'} · Joined {formatDate(user.createdAt)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => startEdit(user)} className="rounded-full border border-black/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-black">Edit</button>
                  <button type="button" onClick={() => onUpdateUser(user._id, { isActive: !user.isActive })} className="rounded-full border border-black/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-black">
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button type="button" onClick={() => onDeleteUser(user._id)} className="rounded-full border border-red-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-red-600">
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}

          {!users.length && (
            <div className="rounded-[24px] border border-dashed border-black/10 p-8 text-center text-black/45">
              No users found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
