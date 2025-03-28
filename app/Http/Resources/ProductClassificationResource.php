<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductClassificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this->id,
            'name'=>$this->name,
            'category'=>$this?->category?->name,
            'properties'=>$this->properties,
            'brand'=>$this?->brand?->name ,
            'unit'=>$this?->unit?->name ,
            'cost'=>$this?->latestProductValueVariation?->cost,
            'price'=>$this?->latestProductValueVariation?->price
        ];
    }
}
