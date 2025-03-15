<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUnitRequest;
use App\Http\Requests\UpdateUnitRequest;
use App\Http\Resources\UnitResource;
use Inertia\Inertia;
use Inertia\Response;
class UnitController extends Controller
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
    public function store(StoreUnitRequest $request)
    {
        $rawInput =$request->validated();  
        Unit::create($rawInput); 
    }

    public function fetch(string $input)
    {
        $addNewUnit = false; 
        $request = new StoreUnitRequest();
        if($request->authorize()) 
        {
         $addNewUnit= true;
        } 
       return [$addNewUnit,Unit::where('name','like','%'.$input.'%')->get()->pluck('name')];
    }

    public function check(string $input)
    {
      return Unit::where('name',$input)->count();
    }

    /**
     * Display the specified resource.
     */
    public function show(Unit $unit)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Unit $unit)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUnitRequest $request, Unit $unit)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Unit $unit)
    {
        //
    }
}
