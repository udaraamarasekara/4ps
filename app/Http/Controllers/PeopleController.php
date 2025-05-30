<?php

namespace App\Http\Controllers;

use App\Models\People;
use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePeopleRequest;
use App\Http\Requests\UpdatePeopleRequest;
use App\Models\PeopleClassification;
use Exception;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PeopleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
              return Inertia::render('NewPerson');
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
      $rawInput = $request->validated();
      if($rawInput['type']=='User')
      {
       DB::table('people_user_roles')->insert(['rolable_type'=>'App\Models\User::class','rolable_id'=>$rawInput['user']]);
      }
      else
      {
       try{ 
        DB::beginTransaction();
        $fileName = time().'.'.$rawInput['user']['photo']->getClientOriginalExtension();
        Storage::disk('public')->put($fileName, file_get_contents($rawInput['user']['photo'])); 
        $people = People::create(['name'=>$rawInput['user']['name'],'email'=>$rawInput['user']['email'],'address'=>$rawInput['user']['address'],'photo'=>$fileName]);
        DB::table('people_user_roles')->insert(['rolable_type'=>'App\Models\People::class','rolable_id'=>$people->id]);
        DB::commit(); 
    }catch(Exception $e)
       {dd($e);
        DB::rollBack();
       }     
      }
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

    public function fetch(string $input)
    {
      return User::where('name', 'like', "%{$input}%")->get();
    }
}
