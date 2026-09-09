<?php

namespace App\Http\Controllers;

use App\Models\Dealer;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ReturnTransaction;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function financialSummary(Request $request)
    {
        $data = $request->validate([
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date'],
        ]);
        $from = $data['from'] ?? now()->startOfMonth();
        $to = $data['to'] ?? now()->endOfDay();

        $sales = Product::where('deal_type', 'sale')->whereBetween('created_at', [$from, $to])->sum('total_bill');
        $received = Product::where('deal_type', 'receive')->whereBetween('created_at', [$from, $to])->sum('total_bill');
        $income = Payment::where('direction', 'income')->whereBetween('paid_at', [$from, $to])->sum('amount');
        $expenses = Payment::where('direction', 'expense')->whereBetween('paid_at', [$from, $to])->sum('amount');
        $returns = ReturnTransaction::whereBetween('created_at', [$from, $to])->sum('total_amount');

        $balances = Dealer::query()->get()->map(function (Dealer $dealer) use ($from, $to): array {
            $billed = Product::where('dealer_id', $dealer->id)->whereBetween('created_at', [$from, $to])->sum('total_bill');
            $paid = Payment::where('dealer_id', $dealer->id)->whereBetween('paid_at', [$from, $to])->sum('amount');
            $returned = ReturnTransaction::where('dealer_id', $dealer->id)->whereBetween('created_at', [$from, $to])->sum('total_amount');

            return [
                'id' => $dealer->id,
                'name' => $dealer->name,
                'role' => $dealer->role,
                'billed' => round((float) $billed, 2),
                'paid' => round((float) $paid, 2),
                'returned' => round((float) $returned, 2),
                'balance' => round((float) ($billed - $paid - $returned), 2),
            ];
        })->values();

        return response()->json([
            'period' => ['from' => $from, 'to' => $to],
            'sales' => round((float) $sales, 2),
            'purchases' => round((float) $received, 2),
            'cash_income' => round((float) $income, 2),
            'cash_expense' => round((float) $expenses, 2),
            'returns' => round((float) $returns, 2),
            'gross_cash_flow' => round((float) ($income - $expenses), 2),
            'dealer_balances' => $balances,
        ]);
    }
}
