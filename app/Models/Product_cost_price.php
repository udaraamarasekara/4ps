<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product_cost_price extends Model
{
    use BelongsToTenant;
    use HasFactory,SoftDeletes;
    protected $guarded=[];
}
