<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use  App\Http\Requests\StoreProjectClassificationRequest;
use App\Models\ProjectClassification;
use Inertia\Inertia;
class ProjectClassificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('ProjectClassification');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('NewProjectClassification');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectClassificationRequest $request)
    {
      ProjectClassification::create($request->validated());
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
