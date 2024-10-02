<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectClassification extends Model
{
  use HasFactory, SoftDeletes;
  protected $guarded = [];
    public function children():HasManny
    {
      return $this->hasMany(ProjectClassification::class,'parent_id')->paginate(10);
    }

    public function parent():BelongsTo
    {
      return $this->belongsTo(ProjectClassification::class,'parent_id')->get();
    }
}
