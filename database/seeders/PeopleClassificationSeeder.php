<?php

namespace Database\Seeders;

use App\Models\PeopleClassification;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PeopleClassificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      $people_classifications =  [
            ['name' => 'Customer'],
            ['name' => 'Supplier'],
            ['name' => 'Employee']

        ];

        foreach($people_classifications as $pclas)
        {
        PeopleClassification::create($pclas);
        }
    }
}
