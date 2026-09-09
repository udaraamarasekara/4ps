import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        tenant_name: '',
        owner_name: '',
        owner_email: '',
        owner_password: '',
        owner_password_confirmation: '',
        plan: 'starter',
        paid_until: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('platform.tenants.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create workspace" />
            <div className="py-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6"><Link href={route('platform.tenants.index')} className="text-sm underline">Back to workspaces</Link><h1 className="text-2xl font-semibold text-gray-900 mt-3">Create workspace</h1></div>
                <form onSubmit={submit} className="bg-white shadow-sm rounded-lg p-6 space-y-5">
                    <div><InputLabel value="Workspace name" /><TextInput value={data.tenant_name} className="mt-1 block w-full" onChange={(e) => setData('tenant_name', e.target.value)} required /><InputError message={errors.tenant_name} /></div>
                    <div><InputLabel value="Owner name" /><TextInput value={data.owner_name} className="mt-1 block w-full" onChange={(e) => setData('owner_name', e.target.value)} required /><InputError message={errors.owner_name} /></div>
                    <div><InputLabel value="Owner email" /><TextInput type="email" value={data.owner_email} className="mt-1 block w-full" onChange={(e) => setData('owner_email', e.target.value)} required /><InputError message={errors.owner_email} /></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><InputLabel value="Temporary password" /><TextInput type="password" value={data.owner_password} className="mt-1 block w-full" onChange={(e) => setData('owner_password', e.target.value)} required /><InputError message={errors.owner_password} /></div>
                        <div><InputLabel value="Confirm password" /><TextInput type="password" value={data.owner_password_confirmation} className="mt-1 block w-full" onChange={(e) => setData('owner_password_confirmation', e.target.value)} required /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><InputLabel value="Plan" /><select value={data.plan} onChange={(e) => setData('plan', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md"><option value="starter">Starter</option><option value="professional">Professional</option><option value="enterprise">Enterprise</option></select></div>
                        <div><InputLabel value="Paid through" /><TextInput type="date" value={data.paid_until} className="mt-1 block w-full" onChange={(e) => setData('paid_until', e.target.value)} /><InputError message={errors.paid_until} /></div>
                    </div>
                    <PrimaryButton disabled={processing}>Create workspace</PrimaryButton>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
