<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
      $rawInput =$request->validated();  
      Category::create($rawInput); 
    }


    public function fetch(string $input)
    {
       $addNewCategory = false; 
       $request = new StoreCategoryRequest();
       if($request->authorize()) 
       {
        $addNewCategory= true;
       }
       return [$addNewCategory,Category::where('name','like','%'.$input.'%')->get()->pluck('name')];
    }

    public function check(string $input)
    {
      return Category::where('name',$input)->count();
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
