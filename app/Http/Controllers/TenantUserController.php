<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Support\Tenancy\TenantContext;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TenantUserController extends Controller
{
    public function index(TenantContext $tenantContext): Response
    {
        return Inertia::render('Settings/Users', [
            'branches' => $tenantContext->tenant()->branches()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'code']),
            'users' => $tenantContext->tenant()->users()->with('branches')->select('users.id', 'name', 'email')->get()->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->pivot->role,
                'branch_ids' => $user->branches->where('tenant_id', $tenantContext->id())->pluck('id')->all(),
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
            'branch_id' => ['required', 'integer', Rule::exists('branches', 'id')->where(fn ($query) => $query->where('tenant_id', $tenantContext->id())->where('is_active', true))],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'is_approved' => true,
        ]);

        $tenantContext->tenant()->users()->attach($user, ['role' => $data['role']]);
        $user->branches()->attach($data['branch_id']);

        return back()->with('success', 'Staff account created.');
    }

    public function update(Request $request, User $user, TenantContext $tenantContext): RedirectResponse
    {
        $data = $request->validate([
            'role' => ['required', 'in:owner,manager,cashier,inventory'],
            'branch_ids' => ['required', 'array', 'min:1'],
            'branch_ids.*' => [Rule::exists('branches', 'id')->where(fn ($query) => $query->where('tenant_id', $tenantContext->id())->where('is_active', true))],
        ]);
        abort_unless($tenantContext->tenant()->users()->whereKey($user->id)->exists(), 404);
        $tenantContext->tenant()->users()->updateExistingPivot($user->id, ['role' => $data['role']]);
        $user->branches()->sync($data['branch_ids']);

        return back()->with('success', 'Staff role updated.');
    }

    public function destroy(User $user, TenantContext $tenantContext): RedirectResponse
    {
        if ($user->id === request()->user()->id) {
            return back()->withErrors(['user' => 'You cannot revoke your own access.']);
        }

        abort_unless($tenantContext->tenant()->users()->whereKey($user->id)->exists(), 404);
        $tenantContext->tenant()->users()->detach($user->id);

        return back()->with('success', 'Staff access revoked.');
    }
}
