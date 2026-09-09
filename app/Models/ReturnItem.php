<?php

namespace App\Models;

use App\Models\Concerns\BelongsToBranch;
use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReturnItem extends Model
{
    use BelongsToTenant, BelongsToBranch;

    protected $guarded = [];

    protected function casts(): array
    {
        return ['quantity' => 'decimal:3', 'unit_amount' => 'decimal:2'];
    }

    public function returnTransaction(): BelongsTo { return $this->belongsTo(ReturnTransaction::class); }
    public function productClassification(): BelongsTo { return $this->belongsTo(ProductClassification::class); }
}
