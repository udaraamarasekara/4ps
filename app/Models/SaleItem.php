<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Concerns\BelongsToTenant;
class SaleItem extends Model
{
    use BelongsToTenant;
        use SoftDeletes;
    protected $guarded = [];
    public function productClassification(): BelongsTo
    {
        return $this->belongsTo(ProductClassification::class);
    }
}
