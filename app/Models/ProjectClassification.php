<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectClassification extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function children():HasManny
    {
      return $this->hasMany(Ca)
    }
}
