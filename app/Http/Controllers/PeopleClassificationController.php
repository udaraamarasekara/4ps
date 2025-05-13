<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePeopleClassificationRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Resources\PeopleClassificationResource;
use App\Models\PeopleClassification;

class PeopleClassificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $peopleClassifications = PeopleClassificationResource::collection(PeopleClassification::paginate(10));
        return Inertia::render('PeopleClassification',['peopleClassifications'=>$peopleClassifications]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('NewPeopleClassification');

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePeopleClassificationRequest $request)
    {
        $input =  $request->validated();
        PeopleClassification::create(['type_id'=>$input['type'],'name'=>$input['name']]);
        return back();
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

    public function fetch(string $input)
    {
        return PeopleClassification::
        where('name', 'like', "%{$input}%")
        ->select('name','id')
        ->get(); 
    }

}
