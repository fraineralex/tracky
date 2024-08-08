import { State } from "../_actions";

export default function BodyMetrics({ formState }: { formState: State }) {
	return (
		<section>
			<div>
				<label>Height</label>
				<p>Enter your height.</p>
				<input type='number' name='height' required />
				{formState.errors?.height ? (
					<div
						id='height-error'
						aria-live='polite'
						className='mt-2 text-sm text-red-500'
					>
						{formState.errors.height.map((error: string) => (
							<p key={error}>{error}</p>
						))}
					</div>
				) : null}
			</div>
			<div>
				<label>Weight</label>
				<p>Enter your weight.</p>
				<input type='number' name='weight' required />
				{formState.errors?.weight ? (
					<div
						id='weight-error'
						aria-live='polite'
						className='mt-2 text-sm text-red-500'
					>
						{formState.errors.weight.map((error: string) => (
							<p key={error}>{error}</p>
						))}
					</div>
				) : null}
			</div>
            <input type='hidden' name='heightUnit' value='cm' />
            <input type='hidden' name='weightUnit' value='lb' />
		</section>
	)
}
