<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $tenant = DB::table('tenants')->where('slug', 'default-workspace')->first();

        if (! $tenant) {
            return;
        }

        $tables = [
            'tenant_user',
            'properties',
            'product_classifications',
            'dealers',
            'brands',
            'units',
            'categories',
            'product_value_variations',
            'stocks',
            'products',
            'product_classification_images',
            'sale_items',
            'product_classification_property',
            'stock_movements',
            'audit_logs',
            'payments',
            'return_transactions',
            'return_items',
        ];

        foreach ($tables as $table) {
            if (DB::table($table)->where('tenant_id', $tenant->id)->exists()) {
                return;
            }
        }

        if (DB::table('branch_user')->whereIn(
            'branch_id',
            DB::table('branches')->select('id')->where('tenant_id', $tenant->id)
        )->exists()) {
            return;
        }

        DB::table('tenants')->where('id', $tenant->id)->delete();
    }

    public function down(): void
    {
        // The removed workspace contained no users or business data to restore.
    }
};