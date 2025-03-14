import axios from 'axios';
import { useRef,useState,useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AutoCompleteTextInput from '@/Components/AutoCompleteTextInput';
import NewCategoryModal from './NewCategoryModal';
import DynamicPropertyPane from '@/Components/DynamicPropertyPane';
export default function NewProdClasFormPartOne({setData=()=>{},errors,processing,movetoPartTwo=()=>{},clearErrors=()=>{},setError=()=>{},data}){
    const prevCatSugst =  useRef();
    const productName = useRef();
    const category = useRef();
    const isNotInitialMount = useRef(false);
    const [showCategory,setShowCategory] = useState(false)
    const [addNewCategory,setAddNewCategory] = useState(false);
    const [categorySugges,setCategorySugges] = useState();
    const [propertiesVar,setPropertiesVar] = useState([]);
    const updateCategorySuggessions =async (input) =>{
        const response = await axios.get(route('category.fetch',input ? input: '-0'))
        setCategorySugges(response.data[1])
        setAddNewCategory(response.data[0])
       
        console.log(categorySugges)
    }  
    
    useEffect(()=>{
        if(isNotInitialMount.current) 
        {  
            if(!categorySugges?.length && category.current.value!=='' && prevCatSugst!==data.category_name ){
               addNewCategory ? setError('category_name','No such a Category. Click to add new category'): setError('category_name','No such a Category')
           }else{
              clearErrors('category_name') 
           }
        }
        else
        {
          isNotInitialMount.current =true;  
        }     
     },[category.current?.value])
    
 return (
    <div className='w-full pb-6 flex justify-center'>
    <NewCategoryModal show={showCategory} setShow={setShowCategory}/>
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
                        <InputLabel htmlFor="category" value="Category" />

                        <AutoCompleteTextInput
                            id="category"
                            ref={category}
                            value={data.category_name}
                            suggestions={categorySugges}
                            onChange={(e) => updateCategorySuggessions(e.target.value)}
                            setClickedElement={(el)=>{setData('category_name',el),prevCatSugst.current=el}}
                            className="mt-1 block w-full"
                        />
                        {addNewCategory ?
                          <div onClick={()=>setShowCategory(true)}>
                            <InputError message={errors.category_name} className="mt-2 hover:underline hover:cursor-pointer" /> 
                          </div>  
                         :<InputError message={errors.category_name} className="mt-2" />
                        }
                    </div>
                </div>
                <div>
                    <InputLabel htmlFor="properties" value="Add if any other propertiesb  "/>

                    <DynamicPropertyPane deleteProperty={(name) =>setPropertiesVar((prev) => prev.filter((prop) => prop.name !== name))} addProperty={(newProp)=>setPropertiesVar([...propertiesVar,newProp])} properties={propertiesVar}/>
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Next</PrimaryButton>
                
                </div>
        </form>
    </section>
    </div> 
 );

}