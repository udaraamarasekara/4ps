<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

class ProfileController extends Controller
{
    public function index()
    {
        return Inertia::render('Users/Index', [
            'profiles' => User::latest()->paginate(10),
        ]);
    }

    public function create()
    {
        return Inertia::render('Users/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
        ]);

        User::create($validated);

        return redirect()
            ->route('profiles.index')
            ->with('success', 'User created successfully');
    }

    public function show(User $profile)
    {
        return Inertia::render('Users/Show', [
            'profile' => $profile,
        ]);
    }

    public function edit(User $profile)
    {
        return Inertia::render('Profile/Edit', [
            'profile' => $profile,
        ]);
    }

    public function update(Request $request, User $profile)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $profile->id,
            'phone' => 'nullable|string|max:20',
        ]);

        $profile->update($validated);

        return redirect()
            ->route('profiles.index')
            ->with('success', 'User updated successfully');
    }

    public function destroy(User $profile)
    {
        $profile->delete();

        return redirect()
            ->route('profiles.index')
            ->with('success', 'User deleted successfully');
    }
}
