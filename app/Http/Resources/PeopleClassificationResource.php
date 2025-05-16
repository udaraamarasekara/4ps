<?php

namespace App\Http\Resources;

use App\Models\PeopleClassification;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PeopleClassificationResource extends JsonResource
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
            'type_id'=>$this->type_id,
            'type'=>PeopleClassification::find($this->type_id)?->name,
            
        ];  
    }
}
