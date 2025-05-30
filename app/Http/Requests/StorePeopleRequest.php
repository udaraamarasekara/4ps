<?php

namespace App\Http\Requests;
use Illuminate\Validation\Rule;

use Illuminate\Foundation\Http\FormRequest;

class StorePeopleRequest extends FormRequest
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
        'role' => ['required', 'string'],
        'type' => ['required', 'string', Rule::in(['User', 'NonUser'])],

        'user' => [
            'required',
            Rule::when(fn($input) => $input->type === 'NonUser', ['array']),
            Rule::when(fn($input) => $input->type === 'User', ['integer']),
        ],

        'user.name' => Rule::when(
            fn($input) => $input->type === 'NonUser',
            ['required', 'string']
        ),

        'user.email' => Rule::when(
            fn($input) => $input->type === 'NonUser',
            ['required', 'string', 'email']
        ),

        'user.address' => Rule::when(
            fn($input) => $input->type === 'NonUser',
            ['required', 'string']
        ),

        'user.photo' => Rule::when(
            fn($input) => $input->type === 'NonUser',
            ['required', 'image']
        ),
    ];
    }
}
