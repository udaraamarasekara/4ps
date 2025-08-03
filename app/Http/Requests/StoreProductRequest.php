<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'items' => 'nullable|array',
            'items.*.product_classification_id' => ['required_if:items,!=,null|exists:product_classifications,id'],
            'items.*.quantity' => ['required_if:items,!=,null|numeric|min:1|max:999999.99'],
        ];
    }
}
