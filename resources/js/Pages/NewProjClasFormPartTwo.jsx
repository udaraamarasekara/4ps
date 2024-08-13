import axios from 'axios';
import { useRef,useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AutoCompleteTextInput from '@/Components/AutoCompleteTextInput';
export default function NewProjClasFormPartTwo({setData=()=>{},errors,processing,addNewProjectClassification=()=>{},clearErrors=()=>{},setError=()=>{},data}){

    const [currentIngredient,setCurrentIngredient] = useState();
    const [currentIngredientAmount,setCurrentIngredientAmount] = useState();
    const [currentHumanAmount,setCurrentHumanAmount] = useState();
    const [currentHuman,setCurrentHuman] = useState();
    const ingredients = useRef();
    const [suggessioins,setSuggessions] = useState();
    const updateIngredientSuggessions =async (input) =>{
        const response = await axios.get(route('productClassification.fetch',input ? input: '-0'))
        setSuggessions(response.data.data)
        console.log(suggessioins)
    }  
 return (
    <div className='flex flex-col md:flex-row'>
        <div className='w-full pb-6 flex flex-col md:flex-row md:w-1/2 items-center md:justify-center'>
            <section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
                <form onSubmit={(e)=>addNewProjectClassification(e)} className="mt-6 space-y-6">
                        <div className='flex flex-col md:flex-row md:space-x-4'>
                            
                            <div className='w-full md:w-1/2' >
                                <InputLabel htmlFor="ingredient" value="Ingredient (optional)" />

                                <AutoCompleteTextInput
                                    id="ingredient"
                                    value={currentIngredient}
                                    suggestions={suggessioins}
                                    onChange={(e) => updateIngredientSuggessions(e.target.value)}
                                    className="mt-1 block w-full"
                                />

                                <InputError message={errors.name} className="mt-2" />
                            </div>
                            <div className='w-full md:w-1/2' >
                                <InputLabel htmlFor="Amount" value="Amount" />

                                <TextInput
                                    id="amount"
                                    value={currentIngredientAmount }
                                    onChange={(e) => setCurrentIngredientAmount(e.target.value)}
                                    type="text"
                                    className="mt-1 block w-full"
                                    autoComplete="amount"
                                />

                                <InputError message={errors.name} className="mt-2" />
                            </div>

                        </div>
                        <div className="flex items-center gap-4">
                            <PrimaryButton disabled={processing}>Add item</PrimaryButton>
                        
                        </div>
                        <div>
                            <InputLabel htmlFor="ingredients" value="Ingredients"/>
                            <div  id="ingredients" className="mt-1 min-h-full border rounded-md px-3 py-2 block w-full">
                                
                            </div>

                        </div>
                </form>
            </section>
        </div> 

        <div className='w-full pb-6 flex flex-col md:flex-row md:w-1/2 items-center md:justify-center'>
            <section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
                <form onSubmit={(e)=>addNewProjectClassification(e)} className="mt-6 space-y-6">
                        <div className='flex flex-col md:flex-row md:space-x-4'>
                            
                            <div className='w-full md:w-1/2' >
                                <InputLabel htmlFor="human" value="Human resource (minimum 1)" />

                                <AutoCompleteTextInput
                                    id="human"
                                    value={currentHuman}
                                    suggestions={suggessioins}
                                    onChange={(e) => updateHumanSuggessions(e.target.value)}
                                    className="mt-1 block w-full"
                                />

                                <InputError message={errors.ingredient} className="mt-2" />
                            </div>
                            <div className='w-full md:w-1/2' >
                                <InputLabel htmlFor="Amount" value="Amount" />

                                <TextInput
                                    id="amount"
                                    value={data.amount}
                                    onChange={(e) => setCurrentHumanAmount(e.target.value)}
                                    type="text"
                                    className="mt-1 block w-full"
                                    autoComplete="amount"
                                />

                                <InputError message={errors.name} className="mt-2" />
                            </div>

                        </div>
                        <div className="flex items-center gap-4">
                            <PrimaryButton disabled={processing}>Add item</PrimaryButton>
                        
                        </div>
                        <div>
                            <InputLabel htmlFor="humans" value="humans"/>
                            <div  id="humans" className="mt-1 min-h-full border rounded-md px-3 py-2 block w-full">
                                
                            </div>

                        </div>

                       
                </form>
            </section>
        </div> 
    </div>
 );

}