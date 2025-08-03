<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('people_user_roles', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->morphs('rolable');
            $table->foreignId('people_classification_id');
            $table->softDeletes();  // Adds a `deleted_at` column

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
