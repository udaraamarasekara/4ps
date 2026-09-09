<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductValueVariation extends Model
{
  use BelongsToTenant;
    use HasFactory, SoftDeletes;
    protected $guarded = [];

    public function productClassification(): BelongsTo
    {
      return $this->belongsTo(ProductClassification::class);   
    }
}
