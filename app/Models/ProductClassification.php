<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductClassification extends Model
{
  use HasFactory, SoftDeletes;
  protected $guarded = [];

  protected $casts = [
    'properties' => 'array', // Ensure properties is stored as JSON
  ];

    public function brand()
    {
      return $this->belongsTo(Brand::class);   
    }

    public function unit()
    {
      return $this->belongsTo(Unit::class);
    }

    public function parent()
    {
      return $this->belongsTo(ProductClassification::class,'parent_id');
    }

    public function productValueVariations()
    {
      return $this->hasMany(ProductValueVariation::class,'product_classifications_id');
    }
    public function latestProductValueVariation()
    {
        return $this->hasOne(ProductValueVariation::class, 'product_classifications_id')
                    ->latest('updated_at'); // Orders by `updated_at`
    }

}
