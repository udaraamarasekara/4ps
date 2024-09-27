import axios from 'axios';
import { useRef,useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AutoCompleteTextInput from '@/Components/AutoCompleteTextInput';
import TextArea from '@/Components/TextArea';
export default function NewProjClasFormPartOne({setData=()=>{},errors,processing,movetoPartTwo=(e)=>{},clearErrors=()=>{},setError=()=>{},data}){

    const projectName = useRef();
    const parentProject = useRef();
    const description = useRef();
    const [suggessioins,setSuggessions] = useState();
    const updateParentProjectSuggessions =async (input) =>{
        const response = await axios.get(route('projectClassification.fetch',input ? input: '-0'))
        setSuggessions(response.data)
        if(!suggessioins?.length){
             setError('parent_name','No such a project classification')
        }else{
           clearError('parent_name') 
        }
        console.log(suggessioins)
    }  
 return (
    <div className='w-full pb-6 flex justify-center'>
    <section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
        <form onSubmit={(e)=>movetoPartTwo(e)} className="mt-6 space-y-6">
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
                            value={data.parent_name}
                            suggestions={suggessioins}
                            onChange={(e) => updateParentProjectSuggessions(e.target.value)}
                            className="mt-1 block w-full"
                        />

                        <InputError message={errors.parent_name} className="mt-2" />
                    </div>
                </div>
                <div>
                    <InputLabel htmlFor="description" value="Description (100 or more characters )"/>

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
                    <PrimaryButton disabled={processing}>Next</PrimaryButton>
                
                </div>
        </form>
    </section>
    </div> 
 );

}