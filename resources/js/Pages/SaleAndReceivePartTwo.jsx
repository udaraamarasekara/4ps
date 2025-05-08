import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useRef,useState } from 'react';
import AutoCompleteTextInput from '@/Components/AutoCompleteTextInput';
import { useEffect } from 'react';
export default function SaleAndReceivePartTwo({setData=()=>{},errors,processing,movetoPartOne=()=>{},clearErrors=()=>{},setError=()=>{},data,operation}){
    const [suggesioinsThirdParty,setSuggessionsThirdParty] = useState();
     
    const [tot,setTot] = useState() 
    useEffect(()=>{
        setTot(data.items.reduce((t, item) => t + item.quantity * item.priceOrCost, 0))
    })
   
    const thirdParty = useRef();

    const updateThirdPartySuggessions =async (input) =>{
        const response = await axios.get(route('people.thirdPartyFetch',input ? input: '-0'))
        var tmpSugests=[];
        response.data.forEach((item)=>{
         tmpSugests.push(item.user_name+' '+item.classification_name)    
        })
        setSuggessionsThirdParty(tmpSugests)
        if(!suggesioinsThirdParty?.length){
             setError('third_party','No such a third party')
        }else{
           clearErrors('third_party') 
        }
    } 



    
    return ( <div className='w-full pb-6 flex justify-center'>
    <section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
        <form onSubmit={(e)=>movetoPartOne(e)} className="mt-6 space-y-6">
        <div className='flex flex-col md:flex-row md:space-x-4'>
                    <div className='w-full md:w-1/2' >
                       <h3>Your Total Bill is LKR : {tot}</h3>
                    </div>
                </div>
                <div className='flex flex-col md:flex-row md:space-x-4'>
                    <div className='w-full md:w-1/2' >
                        <InputLabel htmlFor="third_party" value={operation=="Sale" ? "Customer" : "Supplier"} />
    
                        <AutoCompleteTextInput
                            id="third_party"
                            ref={thirdParty}
                            value={data.third_party}
                            suggestions={suggesioinsThirdParty}
                            onChange={(e) => updateThirdPartySuggessions(e.target.value)}
                            className="mt-1 block w-full"
                            setClickedElement={(el) => setClickedProdClas(el)}
                            
                        />
    
                        <InputError message={errors.product_classification} className="mt-2" />
                    </div>
                </div>
               
                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>
                
                </div>
        </form>
    </section>
    </div>)
    }