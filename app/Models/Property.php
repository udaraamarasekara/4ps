<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\BelongsToTenant;

class Property extends Model
{
    use BelongsToTenant;
    protected $guarded = [];

    public function productClassifications()
    {
        return $this->belongsToMany(ProductClassification::class, 'product_classification_property', 'product_id', 'property_id');
    }
}
