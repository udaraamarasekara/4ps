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

    public function fetch(string $input)
    {
       return PeopleClassification::join('peoples', 'peoples.id', '=', 'people_classifications.people_classifications_id')
       ->join('users', 'users.id', '=', 'people_classifications.users_id')
       ->where('people_classifications.party','third_party')
       ->where('users.name','like','%'.$input.'%')
       ->select('users.name','people_classifications.name')
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
