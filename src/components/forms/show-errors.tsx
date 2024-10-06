export function ShowErrors({ errors }: { errors?: string[] }) {
	if (!errors) return null
	return (
		<>
			{errors.map(error => (
				<small
					key={error}
					className='col-span-5 text-nowrap text-xs text-red-500'
				>
					{error}
				</small>
			))}
		</>
	)
}
