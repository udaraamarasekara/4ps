<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use  App\Http\Requests\StoreProjectClassificationRequest;
use App\Models\ProjectClassification;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Http\Resources\ProjectClassificationResource;
class ProjectClassificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index():Response
    {
        $projectClassifications = ProjectClassificationResource::collection(ProjectClassification::paginate(10));
        return Inertia::render('ProjectClassification',['projectClassifications'=>$projectClassifications]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create():Response
    {
        return Inertia::render('NewProjectClassification');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectClassificationRequest $request)
    {
       $rawInput =$request->validated();  
       $parent_id = ProjectClassification::where('name',$rawInput['parent_name'])->first()->id;
       unset($rawInput['parent_name']);
       $rawInput['parent_id']=$parent_id; 
       ProjectClassification::create($rawInput);
       return back();
    }

    public function fetch(string $input)
    {
       return ProjectClassification::where('name','like','%'.$input.'%')->orWhere('description','like','%'.$input.'%')->get()->pluck('name');
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
