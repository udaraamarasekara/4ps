<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\BelongsToTenant;
use App\Models\Concerns\BelongsToBranch;

class Stock extends Model
{
    use HasFactory, SoftDeletes, BelongsToTenant, BelongsToBranch;
    protected $guarded = [];
 
     


}
