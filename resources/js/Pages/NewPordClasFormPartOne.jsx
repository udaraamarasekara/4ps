import axios from 'axios';
import { useRef,useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AutoCompleteTextInput from '@/Components/AutoCompleteTextInput';
import TextArea from '@/Components/TextArea';
export default function NewProdClasFormPartOne({setData=()=>{},errors,processing,movetoPartTwo=()=>{},clearErrors=()=>{},setError=()=>{},data}){

    const productName = useRef();
    const parentProduct = useRef();
    const description = useRef();
    const [suggessioins,setSuggessions] = useState();
    const updateParentProductSuggessions =async (input) =>{
        const response = await axios.get(route('productClassification.fetch',input ? input: '-0'))
        setSuggessions(response.data)
        if(!suggessioins?.length && parentProduct.current.value!=='' ){
             setError('parent_name','No such a product classification')
        }else{
           clearErrors('parent_name') 
        }
        console.log(suggessioins)
    }  
 return (
    <div className='w-full pb-6 flex justify-center'>
    <section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
        <form onSubmit={(e)=>movetoPartTwo(e)} className="mt-6 space-y-6">
                <div className='flex flex-col md:flex-row md:space-x-4'>
                    <div className='w-full md:w-1/2' >
                        <InputLabel htmlFor="Product name" value="Product name" />

                        <TextInput
                            id="product_name"
                            ref={productName}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                            autoComplete="product_name"
                        />

                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className='w-full md:w-1/2' >
                        <InputLabel htmlFor="parent_product" value="Parent product (optional)" />

                        <AutoCompleteTextInput
                            id="parent_product"
                            ref={parentProduct}
                            value={data.parent_name}
                            suggestions={suggessioins}
                            onChange={(e) => updateParentProductSuggessions(e.target.value)}
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