<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Support\Tenancy\TenantContext;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class TenantUserController extends Controller
{
    public function index(TenantContext $tenantContext): Response
    {
        return Inertia::render('Settings/Users', [
            'users' => $tenantContext->tenant()->users()->select('users.id', 'name', 'email')->get()->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->pivot->role,
            ]),
        ]);
    }

    public function store(Request $request, TenantContext $tenantContext): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'in:manager,cashier,inventory'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'is_approved' => true,
        ]);

        $tenantContext->tenant()->users()->attach($user, ['role' => $data['role']]);

        return back()->with('success', 'Staff account created.');
    }

    public function update(Request $request, User $user, TenantContext $tenantContext): RedirectResponse
    {
        $data = $request->validate(['role' => ['required', 'in:owner,manager,cashier,inventory']]);
        abort_unless($tenantContext->tenant()->users()->whereKey($user->id)->exists(), 404);
        $tenantContext->tenant()->users()->updateExistingPivot($user->id, ['role' => $data['role']]);

        return back()->with('success', 'Staff role updated.');
    }

    public function destroy(User $user, TenantContext $tenantContext): RedirectResponse
    {
        abort_if($user->id === request()->user()->id, 422, 'You cannot revoke your own access.');
        abort_unless($tenantContext->tenant()->users()->whereKey($user->id)->exists(), 404);
        $tenantContext->tenant()->users()->detach($user->id);

        return back()->with('success', 'Staff access revoked.');
    }
}
