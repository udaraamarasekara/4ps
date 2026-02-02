<?php

namespace App\Http\Controllers;
use App\Models\Dealer;
use Illuminate\Http\Request;    
use Inertia\Inertia;
use App\Http\Resources\DealerResource;
class DealerController extends Controller
{
   public function fetchCustomer(String $input)
   {
     return Dealer::where('role', 'customer')->whereAny(['name','telephone'], 'like', '%' . $input . '%')->get();
   }

    public function customers() 
    {   

       $dealers = DealerResource::collection(Dealer::where('role', 'customer')->paginate(10));
      return Inertia::render('Customers', [
        'dealers' => $dealers
      ]);
    }

 public function suppliers() 
    {   

       $dealers = DealerResource::collection(Dealer::where('role', 'supplier')->paginate(10));
      return Inertia::render('Suppliers', [
        'dealers' => $dealers
      ]);
    }
    public function deleteDealer($id)
    {
      Dealer::find($id)->delete();
    }



    public function fetchSupplier(String $input)
   {
     return Dealer::where('role', 'supplier')->whereAny(['name','telephone'], 'like', '%' . $input . '%')->get();
   }

   public function newSupplier(Request $request)
   {
     $request->validate([
       'name' => 'required|string|max:255',
       'telephone' => 'required|string|max:255|unique:dealers,telephone',
     ]);

        return redirect()->back();

   } 


  public function dealer(string $type = null)
   {
    if($type !== 'customer' && $type !== 'supplier'){
      return redirect()->back();
         } 
     return Inertia::render('NewDealer', [
       'type' => $type
     ]);
   }  


   public function newDealer(Request $request)
   {
     $request->validate([
       'name' => 'required|string|max:255',
       'telephone' => 'required|string|max:255|unique:dealers,telephone',
        'type' => 'required|string|in:customer,supplier',
     ]);
      
     Dealer::create([
       'name' => $request->name,
       'telephone' => $request->telephone,
       'role' => $request->type
     ]);

   }
}
