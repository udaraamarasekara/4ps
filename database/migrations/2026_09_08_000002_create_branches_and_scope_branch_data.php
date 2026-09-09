<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('branches', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('code');
            $table->string('address')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->unique(['tenant_id', 'code']);
        });

        foreach (['stocks', 'products'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table): void {
                $table->foreignId('branch_id')->nullable()->constrained()->index();
            });
        }

        $tenants = DB::table('tenants')->pluck('id');
        foreach ($tenants as $tenantId) {
            $branchId = DB::table('branches')->insertGetId([
                'tenant_id' => $tenantId,
                'name' => 'Main Branch',
                'code' => 'MAIN',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('stocks')->where('tenant_id', $tenantId)->update(['branch_id' => $branchId]);
            DB::table('products')->where('tenant_id', $tenantId)->update(['branch_id' => $branchId]);
        }
    }

    public function down(): void
    {
        foreach (['products', 'stocks'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table): void {
                $table->dropForeign(['branch_id']);
                $table->dropColumn('branch_id');
            });
        }

        Schema::dropIfExists('branches');
    }
};
