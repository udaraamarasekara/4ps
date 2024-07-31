import AutoCompleteTextInput from '@/Components/AutoCompleteTextInput';
import TextArea from '@/Components/TextArea';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head,Link,useForm } from '@inertiajs/react';
import { useRef,useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import axios from 'axios';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
export default function NewProjectClassification({ auth }) {

    const projectName = useRef();
    const parentProject = useRef();
    const description = useRef();
    const [suggessioins,setSuggessions] = useState();
    const { data, setData, errors, setError, post, reset, processing, recentlySuccessful } = useForm({
        name: '',
        parent_id: '',
        description: '',
    });

const updateParentProjectSuggessions =async (input) =>{
    const response = await axios.get(route('projectClassification.fetch',input ? input: '-0'))
    setSuggessions(response.data.data)
    console.log(suggessioins)
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
          <ArrowLeftIcon className=' m-6 bold p-3 w-12 h-auto bg-white border border-gray-200 rounded-full text-3xl font-extrabold flex items-center justify-center hover:cursor-pointer' />
        </Link>
        <Transition
            show={true}
            enter="transition ease-in-out"
            enterFrom="opacity-0"
            leave="transition ease-in-out"
            leaveTo="opacity-0"
        >
            <p className="text-sm z-10 bg-green-200 text-green-800 p-4 w-1/3 m-4 fixed top-40  rounded-lg dark:text-gray-400">Saved.</p>
        </Transition>
        <div className='w-full pb-6 flex justify-center'>
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
                                    suggestions={suggessioins}
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
                        
                        </div>
                </form>
            </section>
        </div> 
        </AuthenticatedLayout>
    );
}
