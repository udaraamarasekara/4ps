import axios from 'axios';
import { useRef, useState, useEffect, useCallback } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AutoCompleteTextInput from '@/Components/AutoCompleteTextInput';
import NewCategoryModal from './NewCategoryModal';
import DynamicPropertyPane from '@/Components/DynamicPropertyPane';
import { debounce } from 'lodash';
import { use } from 'react';

export default function NewProdClasFormPartOne({
  setData = () => {},
  errors,
  processing,
  movetoPartTwo = () => {},
  clearErrors = () => {},
  setError = () => {},
  data,
}) {
  const prevCatSugst = useRef('');
  const productName = useRef();
  const category = useRef();
  const isNotInitialMount = useRef(false);

  const [showCategory, setShowCategory] = useState(false);
  const [addNewCategory, setAddNewCategory] = useState(false);
  const [categorySugges, setCategorySugges] = useState([]);
  const [propertiesVar, setPropertiesVar] = useState([]);

  useEffect(() => { 
    clearErrors();
   }, [showCategory]);


  // Debounced API call to fetch suggestions
  const updateCategorySuggessions = useCallback(
    debounce(async (input) => {
      try {
        if (input.trim() === '') {
          setCategorySugges([]);
          setAddNewCategory(false);
          return;
        }
        const response = await axios.get(route('category.fetch', input || '-0'));
        setAddNewCategory(response.data[0]);
        setCategorySugges(response.data[1] || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }, 300),
    []
  );

  // Validate category when user types or API changes
  useEffect(() => {
    if (!isNotInitialMount.current) {
      isNotInitialMount.current = true;
      return;
    }

    if (
      !categorySugges?.length &&
      data.category_name !== '' &&
      prevCatSugst.current !== data.category_name
    ) {
      if (addNewCategory) {
        setError('category_name', 'No such category. Click to add new category');
      } else {
        setError('category_name', 'No such category');
      }
    } else {
      clearErrors('category_name');
    }
  }, [data.category_name, categorySugges, addNewCategory]);

  return (
    <div className="w-full pb-6 flex justify-center">
      <NewCategoryModal  show={showCategory} setShow={()=>{setShowCategory(false)}} />

      <section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
        <form
          encType="multipart/form-data"
          onSubmit={(e) => {
            e.preventDefault();
            setData('properties', propertiesVar);
            movetoPartTwo(e);
          }}
          className="mt-6 space-y-6"
        >
          <div className="flex flex-col md:flex-row md:space-x-4">
            {/* Product Name */}
            <div className="w-full md:w-1/2">
              <InputLabel htmlFor="product_name" value="Product name" />
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

            {/* Category */}
            <div className="w-full md:w-1/2">
              <InputLabel htmlFor="category" value="Category" />

              <AutoCompleteTextInput
                id="category"
                ref={category}
                value={data.category_name}
                suggestions={categorySugges}
                onChange={(e) => {
                  const input = e.target.value;
                  setData('category_name', input);
                  updateCategorySuggessions(input);
                }}
                setClickedElement={(el) => {
                  setData('category_name', el);
                  prevCatSugst.current = el;
                }}
                className="mt-1 block w-full"
              />

              {addNewCategory ? (
                <div onClick={() => setShowCategory(true)}>
                  <InputError
                    message={errors.category_name}
                    className="mt-2 hover:underline hover:cursor-pointer"
                  />
                </div>
              ) : (
                <InputError message={errors.category_name} className="mt-2" />
              )}
            </div>
          </div>

          {/* Properties */}
          <div>
            <InputLabel htmlFor="properties" value="Add if any other properties" />
            <DynamicPropertyPane
              deleteProperty={(name) =>
                setPropertiesVar((prev) => prev.filter((prop) => prop.name !== name))
              }
              addProperty={(newProp) => setPropertiesVar([...propertiesVar, newProp])}
              properties={propertiesVar}
            />
          </div>

          {/* Button */}
          <div className="flex items-center gap-4">
            <PrimaryButton disabled={processing}>Next</PrimaryButton>
          </div>
        </form>
      </section>
    </div>
  );
}
