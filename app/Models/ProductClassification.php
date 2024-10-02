<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductClassification extends Model
{
  use HasFactory, SoftDelete;
  protected $guarded = [];

    public function brand()
    {
      return $this->belongsTo(Brand::class);   
    }

    public function unit()
    {
      return $this->belongsTo(Unit::class);
    }

}
