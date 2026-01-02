<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductClassification extends Model
{
  use HasFactory, SoftDeletes;
  protected $guarded = ['initial_stock_quantity'];

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

    public function category()
    {
      return $this->belongsTo(Category::class);
    }

    public function productValueVariations()
    {
      return $this->hasMany(ProductValueVariation::class);
    }
    public function latestProductValueVariation()
    {
        return $this->hasOne(ProductValueVariation::class)
                    ->latest('updated_at'); // Orders by `updated_at`
    }

    public function stock()
    {
      return $this->hasOne(Stock::class);
    }

    public function image()
    {
      return $this->hasOne(ProductClassificationImage::class);
    }

}
