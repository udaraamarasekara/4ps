<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory,SoftDeletes;
    protected $guarded = [];

    public function dealer()
    {
    return $this->belongsTo(Dealer::class);
    }
    public function productItems()
    {
        return $this->hasMany(SaleItem::class);
    }
}
