import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Branches({ auth, branches, flash }) {
    const hasRootBranch = branches.some((b) => b.parent_id === 0);
    const defaultParentId = hasRootBranch
        ? (branches.find((b) => b.parent_id === 0)?.id ?? branches[0]?.id ?? 0)
        : 0;

    const { data, setData, post, processing, errors, reset } = useForm({
        parent_id: defaultParentId,
        name: '',
        code: '',
        address: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('settings.branches.store'), {
            onSuccess: () => reset('name', 'code', 'address'),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Branches" />
            <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href={route('dashboard')} className="text-sm text-gray-600 underline">Back to dashboard</Link>
                <h1 className="text-2xl font-semibold text-gray-900 mt-3">Branches</h1>
                {flash?.success && <div className="my-4 rounded-md bg-green-50 p-3 text-sm text-green-800">{flash.success}</div>}
                <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Branch Name</th>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Code</th>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Parent Branch</th>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Address</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {branches.map((branch) => (
                                    <tr key={branch.id}>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {branch.parent_id !== 0 && <span className="text-gray-400 mr-2">↳</span>}
                                            {branch.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono text-gray-600">{branch.code}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {branch.parent ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {branch.parent.name}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    Top Level (0)
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{branch.address || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <form onSubmit={submit} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                        <h2 className="font-medium text-gray-900">Create Branch</h2>
                        <div>
                            <InputLabel value="Parent Branch" />
                            <select
                                value={data.parent_id}
                                onChange={(event) => setData('parent_id', Number(event.target.value))}
                                className="mt-1 block w-full border-gray-300 rounded-md text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                {!hasRootBranch && (
                                    <option value={0}>None (Top Level Branch - parent_id: 0)</option>
                                )}
                                {branches.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name} ({b.code})
                                    </option>
                                ))}
                            </select>
                            {hasRootBranch && (
                                <p className="mt-1 text-xs text-gray-500">
                                    Top-level branch already exists. New branches must select a parent branch.
                                </p>
                            )}
                            <InputError message={errors.parent_id} />
                        </div>
                        <div>
                            <InputLabel value="Branch name" />
                            <TextInput value={data.name} className="mt-1 block w-full" onChange={(event) => setData('name', event.target.value)} required />
                            <InputError message={errors.name} />
                        </div>
                        <div>
                            <InputLabel value="Branch code" />
                            <TextInput value={data.code} className="mt-1 block w-full uppercase" onChange={(event) => setData('code', event.target.value.toUpperCase())} required />
                            <InputError message={errors.code} />
                        </div>
                        <div>
                            <InputLabel value="Address" />
                            <TextInput value={data.address} className="mt-1 block w-full" onChange={(event) => setData('address', event.target.value)} />
                            <InputError message={errors.address} />
                        </div>
                        <PrimaryButton disabled={processing}>Create branch</PrimaryButton>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
