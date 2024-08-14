import axios from 'axios';
import { useRef,useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AutoCompleteTextInput from '@/Components/AutoCompleteTextInput';
export default function NewProdClasFormPartTwo({setData=()=>{},errors,processing,movetoPartTwo=()=>{},clearErrors=()=>{},setError=()=>{},data}){

    const brand = useRef();
    const unit = useRef();
    const cost = useRef();
    const price = useRef();

    const [unitSuggessioins,setUnitSuggessions] = useState();
    const [brandSuggessioins,setBrandSuggessions] = useState();

    const updateUnitSuggessions =async (input) =>{
        const response = await axios.get(route('unit.fetch',input ? input: '-0'))
        setUnitSuggessions(response.data)
        if(!unitSuggessioins?.length){
             setError('unit_name','No such a Unit')
        }else{
           clearErrors('unit_name') 
        }
        console.log(unitSuggessioins)
    }  
    const updateBrandSuggessions =async (input) =>{
        const response = await axios.get(route('brand.fetch',input ? input: '-0'))
        setBrandSuggessions(response.data)
        if(!brandSuggessioins?.length){
             setError('brand_name','No such a Brand')
        }else{
           clearErrors('brand_name') 
        }
        console.log(brandSuggessioins)
    }
 return (
    <div className='w-full pb-6 flex justify-center'>
    <section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
        <form onSubmit={(e)=>movetoPartTwo(e)} className="mt-6 space-y-6">
                <div className='flex flex-col md:flex-row md:space-x-4'>
                    <div className='w-full md:w-1/2' >
                        <InputLabel htmlFor="brand_name " value="Brand (optional)" />

                        <AutoCompleteTextInput
                            id="brand_name"
                            ref={brand}
                            value={data.brand_name}
                            suggestions={brandSuggessioins}
                            onChange={(e) => updateBrandSuggessions(e.target.value)}
                            className="mt-1 block w-full"
                        />

                        <InputError message={errors.brand_name} className="mt-2" />
                    </div>

                    <div className='w-full md:w-1/2' >
                        <InputLabel htmlFor="unit_name" value="Unit (optional)" />

                        <AutoCompleteTextInput
                            id="unit_name"
                            ref={unit}
                            value={data.unit_name}
                            suggestions={unitSuggessioins}
                            onChange={(e) => updateUnitSuggessions(e.target.value)}
                            className="mt-1 block w-full"
                        />

                        <InputError message={errors.unit_name} className="mt-2" />
                    </div>
                </div>
                <div className='flex flex-col md:flex-row md:space-x-4'>
                    <div className='w-full md:w-1/2' >
                        <InputLabel htmlFor="cost" value="Cost"/>

                        <TextInput
                            id="cost"
                            value={data.cost}
                            ref={cost}
                            type = "number"
                            onChange={(e) => setData('cost', e.target.value)}
                            className="mt-1 block w-full"
                        />

                        <InputError message={errors.cost} className="mt-2" />
                  </div>
                <div className='w-full md:w-1/2' >
                    <InputLabel htmlFor="price" value="price"/>

                        <TextInput
                            id="price"
                            value={data.price}
                            ref={price}
                            type = "number"
                            onChange={(e) => setData('price', e.target.value)}
                            className="mt-1 block w-full"
                        />

                        <InputError message={errors.price} className="mt-2" />
                    </div>    
                </div>
                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Next</PrimaryButton>
                
                </div>
        </form>
    </section>
    </div> 
 );

}