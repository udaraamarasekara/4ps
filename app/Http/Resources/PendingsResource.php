<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PendingsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'deal_date' => $this->created_at->format('Y-m-d'),
            'dealer' => $this->dealer ? $this->dealer->name : null,
            'total_bill' => $this->total_bill,
            'paid_amount' => $this->paid_amount,
        ];
    }
}
