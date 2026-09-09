<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Support\Tenancy\TenantContext;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    public function switch(Request $request, Branch $branch, TenantContext $tenantContext): RedirectResponse
    {
        abort_unless($branch->is_active, 403);

        $request->session()->put('branch_id', $branch->id);

        return back();
    }
}
