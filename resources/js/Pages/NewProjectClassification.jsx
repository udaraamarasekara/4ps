import AutoCompleteTextInput from '@/Components/AutoCompleteTextInput';
import TextArea from '@/Components/TextArea';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head,Link,useForm } from '@inertiajs/react';
import { useRef } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
export default function NewProjectClassification({ auth }) {

    const projectName = useRef();
    const parentProject = useRef();
    const description = useRef();
    const {get} = useForm({});
    const { data, setData, errors, setError, post, reset, processing, recentlySuccessful } = useForm({
        name: '',
        parent_id: '',
        description: '',
    });

const updateParentProjectSuggessions = (input) =>{
    get(route('projectClassification.fetch',input))
}

const addNewProjectClassification = (e) =>{
    e.preventDefault()
   if(!data.name)
    {
     setError('name','Project name Required')
    }
   else if(!data.description)
    {
     setError('description','Description required')   
    }
   else if(data.description.length<1000)
    {
     setError('description','Description must be at least 1000 characters')   
    } 
    else
    {
        post(route('projectClassification.store'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
               console.log(errors)
            },
        });
    }

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
        <div className='w-full flex justify-center'>
            <section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
                <form onSubmit={addNewProjectClassification} className="mt-6 space-y-6">
                        <div className='flex flex-col md:flex-row md:space-x-4'>
                            <div className='w-full md:w-1/2' >
                                <InputLabel htmlFor="Project name" value="Project name" />

                                <TextInput
                                    id="project_name"
                                    ref={projectName}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    type="text"
                                    className="mt-1 block w-full"
                                    autoComplete="project_name"
                                />

                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className='w-full md:w-1/2' >
                                <InputLabel htmlFor="parent_project" value="Parent project (optional)" />

                                <AutoCompleteTextInput
                                    id="parent_project"
                                    ref={parentProject}
                                    value={data.parent_id}
                                    onChange={(e) => updateParentProjectSuggessions(e.target.value)}
                                    className="mt-1 block w-full"
                                />

                                <InputError message={errors.parent_id} className="mt-2" />
                            </div>
                        </div>
                        <div>
                            <InputLabel htmlFor="description" value="Description (1000 or more characters )"/>

                            <TextArea
                                id="description"
                                value={data.description}
                                ref={description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="mt-1 block w-full"
                            />

                            <InputError message={errors.description} className="mt-2" />
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
            </section>
        </div> 
        </AuthenticatedLayout>
    );
}
