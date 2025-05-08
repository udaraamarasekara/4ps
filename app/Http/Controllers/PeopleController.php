<?php

namespace App\Http\Controllers;

use App\Models\People;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePeopleRequest;
use App\Http\Requests\UpdatePeopleRequest;
use App\Models\PeopleClassification;

class PeopleController extends Controller
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
    public function store(StorePeopleRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(People $people)
    {
        //
    }

    public function thirdPartyFetch(string $input)
    {
        return PeopleClassification::join('people', 'people.people_classifications_id', '=', 'people_classifications.id')
        ->join('users', 'users.id', '=', 'people.users_id')
        ->where('users.name', 'like', "%{$input}%")
        ->select('users.name as user_name', 'people_classifications.name as classification_name','people.id as id')
        ->get(); 
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(People $people)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePeopleRequest $request, People $people)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(People $people)
    {
        //
    }
}
