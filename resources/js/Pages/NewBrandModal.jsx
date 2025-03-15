import Modal from '@/Components/Modal';
import { XMarkIcon } from '@heroicons/react/24/solid';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { useState, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';
import axios from 'axios';
import TextInput from '@/Components/TextInput';

export default function NewBrandModal({ show, setShow }) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);
    const [suggestions, setSuggestions] = useState(null);

    // Debounced function to check brand name
    const checkBrandName = useCallback(
        debounce(async (val) => {
            if (!val) {
                setSuggestions(null);
                setError('');
                return;
            }

            try {
                const response = await axios.get(route('brand.check', val));
                setSuggestions(response.data);
            } catch (error) {
                console.error('Error checking brand name:', error);
                setError('Failed to check brand name. Please try again.');
            }
        }, 300),
        [] // No dependencies needed
    );

    // Handle input change
    const handleInputChange = (e) => {
        const value = e.target.value;
        setName(value); // Update state immediately
        checkBrandName(value); // Call debounced function
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (processing) return;

        setProcessing(true);
        setError('');

        try {
            await axios.post('/brand', { name });
            setShow(false); // Close modal on success
        } catch (error) {
            console.error('Error creating brand:', error);
            setError('Failed to create brand. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    // Update error state based on suggestions
    useEffect(() => {
        if (suggestions) {
            setError('Brand name already exists');
        } else {
            setError('');
        }
    }, [suggestions]);

    return (
        <Modal show={show} maxWidth="xl">
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                <h3 className="text-3xl font-semibold">New Brand</h3>
                <button
                    className="p-0 ml-auto bg-transparent border-0 text-red-500 float-right leading-none outline-none focus:outline-none"
                    onClick={() => setShow(false)}
                >
                    <XMarkIcon className="mt-1 bold p-0 w-6 h-auto text-3xl font-extrabold hover:cursor-pointer" />
                </button>
            </div>
            <form onSubmit={handleSubmit} className="m-6">
                <InputLabel htmlFor="name" value="Name" />
                <TextInput
                    id="name"
                    onChange={handleInputChange}
                    type="text"
                    value={name}
                    className="mt-1 block w-full"
                    autoComplete="name"
                />
                {error && <InputError message={error} className="mt-2" />}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <PrimaryButton disabled={processing}>
                        {processing ? 'Adding...' : 'Add'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}