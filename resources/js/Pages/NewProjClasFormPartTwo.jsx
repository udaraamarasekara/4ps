import axios from 'axios';
import { useRef,useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AutoCompleteTextInput from '@/Components/AutoCompleteTextInput';
export default function NewProjClasFormPartTwo({setData=()=>{},errors,addNewProjectClassification=()=>{},clearErrors=()=>{},setError=()=>{},data}){

    const [currentIngredient,setCurrentIngredient] = useState();
    const [currentIngredientAmount,setCurrentIngredientAmount] = useState();
    const [currentHumanAmount,setCurrentHumanAmount] = useState();
    const [currentHuman,setCurrentHuman] = useState();
    const [currentPropertyAmount,setCurrentPropertyAmount] = useState();
    const [currentProperty,setCurrentProperty] = useState();
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
                            <PrimaryButton onClick={()=>addIngredient()} >Add item</PrimaryButton>
                        
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
                            <PrimaryButton onClick={()=>addHuman()} >Add item</PrimaryButton>
                        </div>
                        <div>
                            <InputLabel htmlFor="humans" value="humans"/>
                            <div  id="humans" className="mt-1 min-h-full border rounded-md px-3 py-2 block w-full">
                                
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
                                <InputLabel htmlFor="property" value="properties (optional)" />

                                <AutoCompleteTextInput
                                    id="property"
                                    value={currentProperty}
                                    suggestions={suggessioins}
                                    onChange={(e) => updatePropertySuggessions(e.target.value)}
                                    className="mt-1 block w-full"
                                />

                                <InputError message={errors.ingredient} className="mt-2" />
                            </div>
                            <div className='w-full md:w-1/2' >
                                <InputLabel htmlFor="Amount" value="Amount" />

                                <TextInput
                                    id="amount"
                                    value={data.amount}
                                    onChange={(e) => setCurrentpropertyAmount(e.target.value)}
                                    type="text"
                                    className="mt-1 block w-full"
                                    autoComplete="amount"
                                />

                                <InputError message={errors.name} className="mt-2" />
                            </div>

                        </div>
                        <div className="flex items-center gap-4">
                            <PrimaryButton onClick={()=>addProperty()} >Add item</PrimaryButton>
                        
                        </div>
                        <div>
                            <InputLabel htmlFor="propertys" value="propertys"/>
                            <div  id="propertys" className="mt-1 min-h-full rounded-md px-3 py-2 block w-full">
                            <section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-x-auto sm:rounded-lg">
                                <table className="w-full  ">
                                    <thead>
                                        <tr>
                                        <th>Name</th>
                                        <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    { productClassifications.data.map(object=>{

                                        return <tr key={object.id}>
                                            <td className='flex justify-center' >{object.name}</td>
                                            <td className='max-w-2 overflow-hidden'>{object.amount}</td>
                                            <td className='flex justify-center gap-5' >
                                                <div onClick={()=>deleteProperty(object.id)} className='bg-red-500 text-white hover:cursor-pointer rounded-full min-w-5 p-2 min-h-5' ><TrashIcon className='min-w-5 h-auto' /></div>
                                            </td>
                                        </tr>
                                    }
                                    )
                                    }
                                    </tbody>
                                </table>
                            </section>
                            </div>

                        </div>

                       
                </form>
            </section>
        </div> 
    </div>
 );

}