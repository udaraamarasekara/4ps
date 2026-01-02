<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductValueVariation extends Model
{
    use HasFactory, SoftDeletes;
    protected $guarded = [];

    public function productClassification(): BelongsTo
    {
      return $this->belongsTo(ProductClassification::class);   
    }
}
