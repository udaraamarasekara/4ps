<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Support\Tenancy\BranchAccess;
use App\Support\Tenancy\TenantContext;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class BranchController extends Controller
{
    public function index(TenantContext $tenantContext): Response
    {
        return Inertia::render('Settings/Branches', [
            'branches' => $tenantContext->tenant()->branches()->with('parent')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request, TenantContext $tenantContext): RedirectResponse
    {
        $tenantId = $tenantContext->id();
        $data = $request->validate([
            'parent_id' => [
                'required',
                'integer',
                function ($attribute, $value, $fail) use ($tenantId) {
                    $parentId = (int) $value;
                    if ($parentId === 0) {
                        $hasRootBranch = Branch::where('tenant_id', $tenantId)->where('parent_id', 0)->exists();
                        if ($hasRootBranch) {
                            $fail('Only one top-level branch (parent_id: 0) is allowed per customer. Please select an existing parent branch.');
                        }
                    } else {
                        $exists = Branch::where('tenant_id', $tenantId)->where('id', $parentId)->exists();
                        if (! $exists) {
                            $fail('The selected parent branch is invalid.');
                        }
                    }
                },
            ],
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', 'alpha_dash', Rule::unique('branches', 'code')->where(fn ($query) => $query->where('tenant_id', $tenantId))],
            'address' => ['nullable', 'string', 'max:255'],
        ]);

        $branch = $tenantContext->tenant()->branches()->create([
            ...$data,
            'parent_id' => (int) ($data['parent_id'] ?? 0),
            'code' => strtoupper($data['code']),
            'is_active' => true,
        ]);
        $branch->users()->syncWithoutDetaching([$request->user()->id]);

        return back()->with('success', 'Branch created.');
    }

    public function switch(Request $request, int $branch, TenantContext $tenantContext, BranchAccess $branchAccess): RedirectResponse
    {
        $branch = $branchAccess->branchesFor($request->user(), $tenantContext->tenant())
            ->firstWhere('id', $branch);
        abort_unless($branch, 403);

        $request->session()->put('branch_id', $branch->id);

        return back();
    }
}
