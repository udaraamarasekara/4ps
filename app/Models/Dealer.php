<?php

namespace App\Models;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\BelongsToTenant;

class Dealer extends Model
{
      use SoftDeletes, BelongsToTenant;

  protected $guarded = [];

}
