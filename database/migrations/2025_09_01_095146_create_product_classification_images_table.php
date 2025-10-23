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
        Schema::create('product_classification_images', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId(column: 'product_classification_id')->constrained();
            $table->string('image_path');
            $table->softDeletes();  // Adds a `deleted_at` column

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_classification_images');
    }
};
