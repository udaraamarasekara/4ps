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
        if ($rawInput['type'] == 'User') {
            DB::table('people_user_roles')->insert(['rolable_type' => 'App\Models\User::class', 'rolable_id' => $rawInput['user']]);
        } else {
            try {
                DB::beginTransaction();
                $fileName = time() . '.' . $rawInput['user']['photo']->getClientOriginalExtension();
                Storage::disk('public')->put($fileName, file_get_contents($rawInput['user']['photo']));
                $people = People::create(['name' => $rawInput['user']['name'], 'email' => $rawInput['user']['email'], 'address' => $rawInput['user']['address'], 'photo' => $fileName]);
                DB::table('people_user_roles')->insert(['rolable_type' => 'App\Models\People::class', 'rolable_id' => $people->id]);
                DB::commit();
            } catch (Exception $e) {
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

    public function thirdPartyFetch(string $input, string $operation)
    {
        $role = 'Supplier';
        if ($operation == 'Sale') {
            $role = 'Customer';
        }
        return DB::table('people_user_roles')
            ->join('people', 'people.id', '=', 'people_user_roles.rolable_id')
            ->join('people_classifications', 'people_classifications.id', '=', 'people_user_roles.people_classification_id')
            ->where('rolable_type', 'App\Models\People::class')
            ->where('people_classifications.root', $role)
            ->where('people.name', operator: 'like', value: "%{$input}%")
            ->select('people.name as user_name', 'people_classifications.name as classification_name')
            ->get()->map(function ($item) {
                $item->table = ' (People)';
                return $item;
            })->merge(
                DB::table('people_user_roles')
                    ->join('users', 'users.id', '=', 'people_user_roles.rolable_id')
                    ->join('people_classifications', 'people_classifications.id', '=', 'people_user_roles.people_classification_id')
                    ->where('rolable_type', 'App\Models\User::class')
                    ->where('people_classifications.root', $role)
                    ->where('users.name', 'like', "%{$input}%")
                    ->select('users.name as user_name', 'people_classifications.name as classification_name')
                    ->get()->map(function ($item) {
                        $item->table = ' (User)';
                        return $item;
                    }   )
            );

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
        return User::where('name', operator: 'like', value: "%{$input}%")->get();
    }
}
