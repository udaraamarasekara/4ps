<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CurrentStockResource extends JsonResource
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
            'brand'=>$this?->brand?->name ,
            'unit'=>$this?->unit?->name ,
            'stock'=>$this->stock?->quantity ?? 0,
        ];
    }
}
