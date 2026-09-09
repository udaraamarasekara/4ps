import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, router, useForm } from '@inertiajs/react';

export default function Users({ auth, users, flash }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', password: '', password_confirmation: '', role: 'cashier',
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('settings.users.store'), { onSuccess: () => reset() });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Staff" />
            <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">Staff access</h1>
                {flash?.success && <div className="my-4 rounded-md bg-green-50 p-3 text-sm text-green-800">{flash.success}</div>}
                <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">User</th><th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Role</th><th className="px-6 py-3" /></tr></thead><tbody className="divide-y divide-gray-200">{users.map((staff) => <tr key={staff.id}><td className="px-6 py-4"><div className="font-medium">{staff.name}</div><div className="text-sm text-gray-500">{staff.email}</div></td><td className="px-6 py-4 text-sm capitalize">{staff.role}</td><td className="px-6 py-4 text-right"><button type="button" onClick={() => router.delete(route('settings.users.destroy', staff.id))} className="text-sm text-red-700 underline">Revoke</button></td></tr>)}</tbody></table>
                    </div>
                    <form onSubmit={submit} className="bg-white rounded-lg shadow-sm p-6 space-y-4"><h2 className="font-medium">Add staff member</h2><div><InputLabel value="Name" /><TextInput value={data.name} className="mt-1 block w-full" onChange={(e) => setData('name', e.target.value)} required /><InputError message={errors.name} /></div><div><InputLabel value="Email" /><TextInput type="email" value={data.email} className="mt-1 block w-full" onChange={(e) => setData('email', e.target.value)} required /><InputError message={errors.email} /></div><div><InputLabel value="Temporary password" /><TextInput type="password" value={data.password} className="mt-1 block w-full" onChange={(e) => setData('password', e.target.value)} required /><InputError message={errors.password} /></div><div><InputLabel value="Confirm password" /><TextInput type="password" value={data.password_confirmation} className="mt-1 block w-full" onChange={(e) => setData('password_confirmation', e.target.value)} required /></div><div><InputLabel value="Role" /><select value={data.role} onChange={(e) => setData('role', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md"><option value="cashier">Cashier</option><option value="inventory">Inventory</option><option value="manager">Manager</option></select></div><PrimaryButton disabled={processing}>Create account</PrimaryButton></form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
