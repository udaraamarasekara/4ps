<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->boolean('is_platform_admin')->default(false)->after('is_approved');
        });

        Schema::table('tenants', function (Blueprint $table): void {
            $table->string('plan')->default('starter')->after('slug');
            $table->string('subscription_status')->default('trialing')->after('plan');
            $table->date('paid_until')->nullable()->after('subscription_status');
        });

        DB::table('users')->orderBy('id')->limit(1)->update(['is_platform_admin' => true]);
    }

    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table): void {
            $table->dropColumn(['plan', 'subscription_status', 'paid_until']);
        });

        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn('is_platform_admin');
        });
    }
};
