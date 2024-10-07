<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
class ProductInstanceController extends Controller
{
    public function productInstanceMainPage()
    {
        return Inertia::render('ProductInstance');
    }
}
