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
        Schema::create('project_classifications', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedInteger('parent_id')->default(0)->index();
            $table->string('name')->unique();
            $table->longText('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_classifications');
    }
};
