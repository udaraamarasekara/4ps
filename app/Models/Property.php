<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    protected $guarded = [];

    public function productClassifications()
    {
        return $this->belongsToMany(ProductClassification::class, 'product_classification_property', 'product_id', 'property_id');
    }
}
