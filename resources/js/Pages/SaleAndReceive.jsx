import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import { useRef,useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AutoCompleteTextInput from '@/Components/AutoCompleteTextInput';
import { Head,useForm,router,Link } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useEffect } from 'react';
export default function SaleAndReceive({auth,operation}){
    const prodClasSugestIds=useRef([]);
    var thirdPartySugestIds=[];
    const [singleItemToSale,setSingleItemToSale] =useState({ 
        product_classification_id: '',
        quantity:'',
        third_party_id:''
    })
   const { data, setData, errors, setError,clearErrors,post, reset, processing, recentlySuccessful } = useForm({
       
     
    });

    useEffect(()=>{

    },[]) 

    function setClickedProdClas(e){
        console.log(prodClasSugestIds.current.filter(i=>i==e).id )
        setSingleItemToSale(prevState => ({
            ...prevState,
            product_classification_id: prodClasSugestIds.current.filter(i=>i.value===e).id  // Update only the changed field
        }));

        console.log(singleItemToSale)
    }

    const productClassification = useRef();
    const thirdParty = useRef();
    const quantity = useRef();

    const [suggessioinsProdClas,setSuggessionsProdClas] = useState();
    const [suggesioinsThirdParty,setSuggessionsThirdParty] = useState();
    const updateProductClassificationSuggessions =async (input) =>{
        const response = await axios.get(route('productClassification.fetchWithUnit',input ? input: '-0'))
        var tmpSugests=[];
        prodClasSugestIds.current=[];
        response.data.forEach((item)=>{
            console.log(item)
         tmpSugests.push(item.name+' '+item.brand+' '+item.unit)  
         prodClasSugestIds.current.push({id:item.id,value:item.name+' '+item.brand+' '+item.unit})  
         console.log(prodClasSugestIds)
        })
        setSuggessionsProdClas(tmpSugests)
        if(!response.data?.length){
             setError('product_classification','No such a project classification')
        }else{
             clearErrors('product_classification') 
        }
    }  
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
    const goBack = () => {
    router.visit(route('product.index'))
     }

return (<AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight"> {operation}  items</h2>}
        >
              <Head title= {operation} />
              <div className='w-full flex justify-end'>
          <ArrowLeftIcon  onClick={()=>goBack()} className=' m-6 bold p-3 w-12 h-auto bg-white border border-gray-200 rounded-full text-3xl font-extrabold flex items-center justify-center hover:cursor-pointer' />
        </div>
            <div className='w-full pb-6 flex justify-center'>
            <section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
                <form onSubmit={(e)=>movetoPartTwo(e)} className="mt-6 space-y-6">
                        <div className='flex flex-col md:flex-row md:space-x-4'>
                            <div className='w-full md:w-1/2' >
                                <InputLabel htmlFor="product_classification" value="Product Class" />

                                <AutoCompleteTextInput
                                    id="product_classification"
                                    ref={productClassification}
                                    value={singleItemToSale.product_classification}
                                    suggestions={suggessioinsProdClas}
                                    onChange={(e) => updateProductClassificationSuggessions(e.target.value)}
                                    className="mt-1 block w-full"
                                    setClickedElement={(el) => setClickedProdClas(el)}
                                    
                                />

                                <InputError message={errors.product_classification} className="mt-2" />
                            </div>
                            <div className='w-full md:w-1/2' >
                                <InputLabel htmlFor="quantity" value="Quantity" />

                                   <TextInput
                                    id="quantity"
                                    ref={quantity}
                                    value={singleItemToSale.name}
                                    onChange={(e) => setData('quantity', e.target.value)}
                                    type="text"
                                    className="mt-1 block w-full"
                                    autoComplete="quantity"
                                />

                                <InputError message={errors.quantity} className="mt-2" />
                            </div>
                        </div>
                        <div className='flex flex-col md:flex-row md:space-x-4'>
                            <div className='w-full md:w-1/2' >
                                <InputLabel htmlFor="third_party" value="Third Party" />

                                <AutoCompleteTextInput
                                    id="third_party"
                                    ref={thirdParty}
                                    value={singleItemToSale.third_party}
                                    suggestions={suggesioinsThirdParty}
                                    onChange={(e) => updateThirdPartySuggessions(e.target.value)}
                                    className="mt-1 block w-full"
                                />

                                <InputError message={errors.third_party} className="mt-2" />
                            </div>
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