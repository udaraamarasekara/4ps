<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia;
class ProjectClassificationTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function index(): void
    {
      $this->get(route('projectClassification.index'))
        ->assertOk()
        ->assertInertia(
         fn(AssertableInertia $page)=>$page
         ->component('ProjectClassification')
         ->where('errors',[])   
        );
    }
}
