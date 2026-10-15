<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('branch_user', function (Blueprint $table): void {
            $table->foreignId('branch_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->primary(['branch_id', 'user_id']);
        });

        DB::table('tenants')->orderBy('id')->each(function (object $tenant): void {
            $branch = DB::table('branches')
                ->where('tenant_id', $tenant->id)
                ->where('is_active', true)
                ->orderBy('id')
                ->first();

            if (! $branch) {
                return;
            }

            $now = now();
            $rows = DB::table('tenant_user')
                ->where('tenant_id', $tenant->id)
                ->pluck('user_id')
                ->map(fn (int $userId): array => [
                    'branch_id' => $branch->id,
                    'user_id' => $userId,
                    'created_at' => $now,
                    'updated_at' => $now,
                ])
                ->all();

            if ($rows) {
                DB::table('branch_user')->insert($rows);
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('branch_user');
    }
};
