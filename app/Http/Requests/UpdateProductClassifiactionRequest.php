<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductClassifiactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'=>['required','string','unique:product_classifications,name'],
            'brand_name'=>['nullable','string','exists:brands,name'],
            'unit_name'=>['required','string','exists:units,name'],
            'category_name'=>['required','string','exists:categories,name'],
            'description'=>['required','string','min:100'],
            'cost'=>['required','regex:/^\d+(\.\d{1,2})?$/'],
            'price'=>['required','regex:/^\d+(\.\d{1,2})?$/']

        ];
    }
}
