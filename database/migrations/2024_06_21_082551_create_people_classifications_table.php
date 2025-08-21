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
        Schema::create('people_classifications', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedInteger('parent_id')->nullable();
            $table->string('root');
            $table->timestamps();
            $table->softDeletes();  // Adds a `deleted_at` column
            $table->unsignedInteger('type_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('people_classifications');
    }
};
