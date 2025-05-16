<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePeopleClassificationRequest;
use App\Http\Requests\UpdatePeopleClassificationRequest;
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
        $root = PeopleClassification::find($input['type'])->root;
        PeopleClassification::create(['type_id'=>$input['type'],'name'=>$input['name'],'root'=>$root]);
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
    public function edit(PeopleClassification $peopleClassification)
    {
             return Inertia::render('EditPeopleClassification',['peopleClassification'=> new PeopleClassificationResource($peopleClassification)]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePeopleClassificationRequest $request, PeopleClassification $peopleClassification)
    {
      $validated = $request->validated();  
      $peopleClassification->update(['name'=>$validated['name'],'type_id'=>$validated['type']]);
      return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PeopleClassification $peopleClassification)
    {
      $peopleClassification->delete();
    }

    public function fetch(string $input)
    {
        return PeopleClassification::
        where('name', 'like', "%{$input}%")
        ->select('name','id')
        ->get(); 
    }

}
