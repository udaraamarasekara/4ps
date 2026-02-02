<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
class SaleItem extends Model
{
        use SoftDeletes;
    protected $guarded = [];
    public function productClassification(): BelongsTo
    {
        return $this->belongsTo(ProductClassification::class);
    }
}
