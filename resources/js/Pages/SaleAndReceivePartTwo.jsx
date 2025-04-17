import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AutoCompleteTextInput from '@/Components/AutoCompleteTextInput';
export default function SaleAndReceivePartTwo({setData=()=>{},errors,processing,movetoPartOne=()=>{},clearErrors=()=>{},setError=()=>{},data}){
    const [suggesioinsThirdParty,setSuggessionsThirdParty] = useState();


    return ( <div className='w-full pb-6 flex justify-center'>
    <section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
        <form onSubmit={(e)=>movetoPartOne(e)} className="mt-6 space-y-6">
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
                        <InputLabel htmlFor="third_party" value={operation==='Sale'?'Customer':'Supplier'} />
    
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
    </div>)
    }