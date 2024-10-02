<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductClassification extends Model
{
  use HasFactory, SoftDeletes;
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
