import Modal from '@/Components/Modal';
import {XMarkIcon} from '@heroicons/react/24/solid';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm } from '@inertiajs/react';

export default function NewBrandModal(){
    const { data, setData, errors, setError,clearErrors,post, reset, processing, recentlySuccessful } = useForm({
        name: '',
  
    });

    return(
      <Modal show={true} maxWidth='sm' >
        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
            <h3 className="text-3xl font-semibold">
              New Brand
            </h3>
            <button
                className="p-0 ml-auto bg-transparent border-0 text-red-500 float-right leading-none  outline-none focus:outline-none"
                onClick={() => alert(false)}
            >
                <XMarkIcon className=' mt-1 bold p-0 w-6 h-auto  text-3xl font-extrabold hover:cursor-pointer' />
            </button>
        </div>          
          <form>
            
          </form>
        <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
           <PrimaryButton disabled={processing}>Add</PrimaryButton>
        </div> 
      </Modal>  
    );
}