<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Concerns\BelongsToTenant;

class Brand extends Model
{
    use HasFactory, SoftDeletes, BelongsToTenant;
    protected $guarded = [];
}
