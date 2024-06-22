import AutoCompleteTextInput from '@/Components/AutoCompleteTextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head,Link,useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function NewProjectClassification({ auth }) {

    const projectName = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

const addNewProjectClassification = () =>{

}

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Project Classification</h2>}
        >
        <Head title="Project Classification" />
        <Link href={route('projectClassification.index')} className='w-full flex justify-end'>
             <div className=' m-6 p-6 w-10 h-10 bg-white border border-gray-200 rounded-full text-3xl font-extrabold flex items-center justify-center hover:cursor-pointer' >+</div>
        </Link>
        <form onSubmit={addNewProjectClassification} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="Project name" value="Project name" />

                    <TextInput
                        id="project_name"
                        ref={projectName}
                        value={data.project_name}
                        onChange={(e) => setData('project_name', e.target.value)}
                        type="text"
                        className="mt-1 block w-full"
                        autoComplete="project_name"
                    />

                    <InputError message={errors.project_name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="parent_project" value="parent_project" />

                    <AutoCompleteTextInput
                        id="parent_project"
                        ref={parentProject}
                        value={data.parent_project}
                        onChange={(e) => setData('parent_project', e.target.value)}
                        type="parent_project"
                        className="mt-1 block w-full"
                    />

                    <InputError message={errors.parent_project} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="rough_duration" value="Rough duration(Days)" />

                    <TextInput
                        id="rough_duration"
                        value={data.rough_duration}
                        onChange={(e) => setData('rough_duration', e.target.value)}
                        type="number"
                        step ="any"
                        className="mt-1 block w-full"
                    />

                    <InputError message={errors.rough_duration} className="mt-2" />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">Saved.</p>
                    </Transition>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
