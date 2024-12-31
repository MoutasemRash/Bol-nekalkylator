import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FromErrorMessage from "./components/FormErrorMessage";

const formSchema = z.object({
  localAmount: z.number().gt(0),
  interestRate: z.number().gt(0),
  repaymentPeriod: z.number().gt(0).lt(20),
});

type FormSchemaType = z.infer<typeof formSchema>;

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalInterest: number;
    totalPayment: number;
  } | null>(null);

  const onSubmit = (data: FormSchemaType) => {
    const { localAmount, interestRate, repaymentPeriod } = data;

    // Annuitet Loan formula:
    // M = P * r * (1 + r)^n / [(1 + r)^n - 1]
    const P = localAmount; // Loan amount
    const r = interestRate / 100 / 12; // Monthly interest rate
    const n = repaymentPeriod * 12; // Total number of payments

    const monthlyPayment =
      (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    const totalPayment = monthlyPayment * n; // Total amount paid over the loan term
    const totalInterest = totalPayment - P; // Total interest paid

    setResult({
      monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
      totalInterest: parseFloat(totalInterest.toFixed(2)),
      totalPayment: parseFloat(totalPayment.toFixed(2)),
    });

    reset();
  };

  return (
    <div className="container mx-auto mt-12">
      <form
        className="mx-auto w-[25%] space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          type="number"
          placeholder="Loan Amount ($)"
          className="bg-primary-background text-primary-foreground w-full rounded-lg text-sm ps-10 px-2.5 py-4 focus:outline-none"
          {...register("localAmount", { valueAsNumber: true })}
        />
        <FromErrorMessage>
          {errors.localAmount &&
            "Invalid number, please enter a number greater than 0"}
        </FromErrorMessage>

        <input
          type="number"
          placeholder="Interest Rate (%)"
          className="bg-primary-background text-primary-foreground w-full rounded-lg text-sm ps-10 px-2.5 py-4 focus:outline-none"
          {...register("interestRate", { valueAsNumber: true })}
        />
        <FromErrorMessage>
          {errors.interestRate &&
            "Invalid number, please enter a number greater than 0"}
        </FromErrorMessage>

        <input
          type="number"
          placeholder="Repayment Period (years)"
          className="bg-primary-background text-primary-foreground w-full rounded-lg text-sm ps-10 px-2.5 py-4 focus:outline-none"
          {...register("repaymentPeriod", { valueAsNumber: true })}
        />
        <FromErrorMessage>
          {errors.repaymentPeriod &&
            "Invalid number, please enter a number greater than 0 and less than 20"}
        </FromErrorMessage>

        <button
          type="submit"
          className="flex items-center w-full justify-center gap-2 bg-slate-400 p-5 rounded-full select-none whitespace-nowrap text-white text-sm font-medium hover:bg-slate-700 transition-colors duration-100"
        >
          Calculate
        </button>
      </form>

      {result && (
        <div className="mt-8 p-4 mx-auto w-[30%] bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Calculation Results</h2>
          <p>
            <strong>Monthly Payment:</strong> ${result.monthlyPayment}
          </p>
          <p>
            <strong>Total Interest:</strong> ${result.totalInterest}
          </p>
          <p>
            <strong>Total Payment:</strong> ${result.totalPayment}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
