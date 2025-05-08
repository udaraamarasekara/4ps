import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { useRef,useState } from 'react';
import TextInput from '@/Components/TextInput';
import AutoCompleteTextInput from '@/Components/AutoCompleteTextInput';
import ProductCart from './ProductCart';
import { useCallback } from 'react';
import { debounce } from 'lodash';

export default function DealAndReceivePartOne({setData=()=>{},errors,processing,clearErrors=()=>{},setError=()=>{},data,operation}){
   const [singleItemToDeal,setSingleItemToDeal] =useState({ 
        product_classification_id: '',
        quantity:'',
        name: '' ,
        brand:'',
        unit: '',
        priceOrCost :''  
    })
    const prodClasSugestIds=useRef([]);
  
    
    function setClickedProdClas(e){
        setSingleItemToDeal(prevState => ({
            ...prevState,
            product_classification_id: prodClasSugestIds.current.filter(i=>i.value===e)[0].id , // Update only the changed field
            name: prodClasSugestIds.current.filter(i=>i.value===e)[0].name  ,
            brand: prodClasSugestIds.current.filter(i=>i.value===e)[0].brand  ,
            unit: prodClasSugestIds.current.filter(i=>i.value===e)[0].unit,
            priceOrCost : prodClasSugestIds.current.filter(i=>i.value===e)[0].priceOrCost    
        }));

        console.log(singleItemToDeal)
    }

    const productClassification = useRef();
    const quantity = useRef();

    const [suggessioinsProdClas,setSuggessionsProdClas] = useState();



    const updateProductClassificationSuggessions =useCallback( debounce(async (input) =>{
        const response = await axios.get(route('productClassification.fetchWithUnit',input ? input: '-0'))
        var tmpSugests=[];
        prodClasSugestIds.current=[];
        response.data.data.forEach((item)=>{
            var val 
            if(operation==='Sale')
            {
             val = item.price
            }
            else
            {
             val = item.cost   
            }
            console.log(item)
         tmpSugests.push(item.name+' '+item.brand+' '+item.unit+' '+val)  
         prodClasSugestIds.current.push({id:item.id,value:item.name+' '+item.brand+' '+item.unit+' '+val,name:item.name,brand:item.brand,unit:item.unit,priceOrCost:val})  
         console.log(prodClasSugestIds)
        })
        setSuggessionsProdClas(tmpSugests)
        if(!response.data.data?.length){
             setError('product_classification','No such a project classification')
        }else{
             clearErrors('product_classification') 
        }
    },300 ),[]) 

return (<div className='w-full pb-6 flex items-center justify-center md:flex-row flex-col'>
<section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
    <form onSubmit={(e)=>e.preventDefault()} className="mt-6 space-y-6">
            <div className='flex flex-col md:flex-row md:space-x-4'>
                <div className='w-full md:w-1/2' >
                    <InputLabel htmlFor="product_classification" value="Product Class" />

                    <AutoCompleteTextInput
                        id="product_classification"
                        ref={productClassification}
                        value={singleItemToDeal.product_classification_id}
                        suggestions={suggessioinsProdClas}
                        onChange={(e) => updateProductClassificationSuggessions(e.target.value)}
                        className="mt-1 block w-full"
                        setClickedElement={(el) => setClickedProdClas(el)}
                        
                    />

                    <InputError message={errors.product_classification_id} className="mt-2" />
                </div>
                <div className='w-full md:w-1/2' >
                    <InputLabel htmlFor="quantity" value="Quantity" />

                       <TextInput
                        id="quantity"
                        ref={quantity}
                        value={singleItemToDeal.quantity}
                        type="text"
                        onChange={(e)=>setSingleItemToDeal(prev=>({...prev,quantity:e.target.value}))}
                        className="mt-1 block w-full"
                        autoComplete="quantity"
                    />

                    <InputError message={errors.quantity} className="mt-2" />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <PrimaryButton 
             onClick={() => {
                if(singleItemToDeal.product_classification_id)
                {    
                if(singleItemToDeal.quantity)
                 {       
                setData(prev => {
                  const isItemExists = prev.items.some(item => item.id === singleItemToDeal.id);
              
                  if (isItemExists) return prev;
              
                  return {
                    ...prev,
                    items: [...prev.items, singleItemToDeal],
                  };
                });
              }else{
                 setError('quantity','you must select a quantity')
              }}else{
                  setError('product_classification_id','you must enter product')
              }
            }
            }
              
                disabled={processing}>Save</PrimaryButton>
            
            </div>
    </form>
</section><ProductCart products={data.items} setProducts={(id)=>  {setData(prev =>({...prev, items:prev.items.filter((item) => item.product_classification_id !== id)}))}}/>
</div>);
}