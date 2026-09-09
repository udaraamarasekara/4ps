import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, tenants, flash }) {
    const toggleTenant = (tenant) => {
        router.put(route('platform.tenants.update', tenant.id), {
            is_active: !tenant.is_active,
            subscription_status: tenant.subscription_status,
            paid_until: tenant.paid_until,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Workspaces" />
            <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Customer workspaces</h1>
                        <p className="text-sm text-gray-600 mt-1">Provision and manage tenant access.</p>
                    </div>
                    <Link href={route('platform.tenants.create')} className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm">
                        New workspace
                    </Link>
                </div>
                {flash?.success && <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">{flash.success}</div>}
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Workspace', 'Plan', 'Subscription', 'Users', 'Status', ''].map((heading) => <th key={heading} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{heading}</th>)}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {tenants.map((tenant) => (
                                <tr key={tenant.id}>
                                    <td className="px-6 py-4"><div className="font-medium text-gray-900">{tenant.name}</div><div className="text-xs text-gray-500">{tenant.slug}</div></td>
                                    <td className="px-6 py-4 text-sm text-gray-700 capitalize">{tenant.plan}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 capitalize">{tenant.subscription_status.replace('_', ' ')}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{tenant.users_count}</td>
                                    <td className="px-6 py-4"><span className={tenant.is_active ? 'text-green-700' : 'text-red-700'}>{tenant.is_active ? 'Active' : 'Suspended'}</span></td>
                                    <td className="px-6 py-4 text-right"><button onClick={() => toggleTenant(tenant)} className="text-sm text-gray-700 underline">{tenant.is_active ? 'Suspend' : 'Activate'}</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
