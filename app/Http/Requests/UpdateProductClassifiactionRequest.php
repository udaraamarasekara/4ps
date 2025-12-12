<?php

namespace App\Http\Requests;
use Illuminate\Validation\Rule;

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
        // 'name' => [
        //     'required',
        //     'string',
        //     Rule::unique('product_classifications', 'name')
        //         ->ignore($this->product_classification_id),
        // ],

        // 'brand_name' => ['nullable','string','exists:brands,name'],
        // 'unit_name' => ['required','string','exists:units,name'],
        // 'category_name' => ['required','string','exists:categories,name'],

        // 'initial_stock_quantity' => ['nullable','regex:/^\d+(\.\d{1,2})?$/'],

        // 'properties' => ['nullable', 'array'],
        // 'properties.*.name' => ['required_with:properties', 'string'],
        // 'properties.*.type' => ['required_with:properties', 'string', 'in:text,number,boolean'],

        // 'cost'=>['required','regex:/^\d+(\.\d{1,2})?$/'],
        // 'price'=>['required','regex:/^\d+(\.\d{1,2})?$/'],

        // 'image'=>['nullable','image','mimes:jpeg,png,jpg,gif,svg','max:5120'],
    ];
    }
}
