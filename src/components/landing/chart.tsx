export function Chart() {
	return (
		<div className='flex flex-col rounded-xl border bg-background text-card-foreground shadow'>
			<div className='flex flex-col items-center space-y-1.5 p-6 pb-0'>
				<h3 className='font-semibold leading-none tracking-tight'>
					Today&apos;s Nutrition Summary
				</h3>
			</div>
			<div className='-mt-3 flex-1 p-6 pb-0 pt-0'>
				<div
					data-chart='chart-R1abt9l7'
					className="[&amp;_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&amp;_.recharts-cartesian-grid_line]:stroke-border/50 [&amp;_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&amp;_.recharts-dot[stroke='#fff']]:stroke-transparent [&amp;_.recharts-layer]:outline-none [&amp;_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&amp;_.recharts-radial-bar-background-sector]:fill-muted [&amp;_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&amp;_.recharts-reference-line-line]:stroke-border [&amp;_.recharts-sector[stroke='#fff']]:stroke-transparent [&amp;_.recharts-sector]:outline-none [&amp;_.recharts-surface]:outline-none mx-auto flex aspect-square max-h-[250px] justify-center text-xs"
				>
					<style>{`
        [data-chart='chart-R1abt9l7'] {
          --color-protein: hsl(var(--chart-1));
          --color-vitamins: hsl(var(--chart-2));
          --color-carbohydrates: hsl(var(--chart-3));
          --color-sugar: hsl(var(--chart-4));
          --color-fats: hsl(var(--chart-5));
        }

        .dark [data-chart='chart-R1abt9l7'] {
          --color-protein: hsl(var(--chart-1));
          --color-vitamins: hsl(var(--chart-2));
          --color-carbohydrates: hsl(var(--chart-3));
          --color-sugar: hsl(var(--chart-4));
          --color-fats: hsl(var(--chart-5));
        }
      `}</style>
					<div
						className='recharts-responsive-container'
						style={{ width: '100%', height: '100%', minWidth: 0 }}
					>
						<div
							className='recharts-wrapper'
							style={{
								position: 'relative',
								cursor: 'default',
								width: '100%',
								height: '100%',
								maxHeight: '250px',
								maxWidth: '250px'
							}}
						>
							<svg
								cx='50%'
								cy='50%'
								className='recharts-surface'
								width='250'
								height='250'
								viewBox='0 0 250 250'
								style={{ width: '100%', height: '100%' }}
							>
								<title></title>
								<desc></desc>
								<defs>
									<clipPath id='recharts2-clip'>
										<rect x='5' y='5' height='240' width='240'></rect>
									</clipPath>
								</defs>
								<g className='recharts-layer recharts-pie' tabIndex={0}>
									<g className='recharts-layer'>
										<g
											className='recharts-layer recharts-pie-sector'
											tabIndex={-1}
										>
											<path
												cx='125'
												cy='125'
												name='protein'
												stroke='#fff'
												fill='var(--color-protein)'
												strokeWidth='5'
												tabIndex={-1}
												className='recharts-sector'
												d='M 221,125
     A 96,96,0,
     0,0,
     71.89940920398085,45.02295793720721
   L 91.81213075248803,75.01434871075452
             A 60,60,0,
             0,1,
             185,125 Z'
												role='img'
											></path>
										</g>
										<g
											className='recharts-layer recharts-pie-sector'
											tabIndex={-1}
										>
											<path
												cx='125'
												cy='125'
												name='vitamins'
												stroke='#fff'
												fill='var(--color-vitamins)'
												strokeWidth='5'
												tabIndex={-1}
												className='recharts-sector'
												d='M 71.89940920398085,45.02295793720721
     A 96,96,0,
     0,0,
     29.948238604673506,138.45966773906102
   L 65.59264912792094,133.41229233691314
             A 60,60,0,
             0,1,
             91.81213075248803,75.01434871075452 Z'
												role='img'
											></path>
										</g>
										<g
											className='recharts-layer recharts-pie-sector'
											tabIndex={-1}
										>
											<path
												cx='125'
												cy='125'
												name='carbohydrates'
												stroke='#fff'
												fill='var(--color-carbohydrates)'
												strokeWidth='5'
												tabIndex={-1}
												className='recharts-sector'
												d='M 29.948238604673506,138.45966773906102
     A 96,96,0,
     0,0,
     131.74651413874807,220.76264692966498
   L 129.21657133671755,184.8516543310406
             A 60,60,0,
             0,1,
             65.59264912792094,133.41229233691314 Z'
												role='img'
											></path>
										</g>
										<g
											className='recharts-layer recharts-pie-sector'
											tabIndex={-1}
										>
											<path
												cx='125'
												cy='125'
												name='sugar'
												stroke='#fff'
												fill='var(--color-sugar)'
												strokeWidth='5'
												tabIndex={-1}
												className='recharts-sector'
												d='M 131.74651413874807,220.76264692966498
     A 96,96,0,
     0,0,
     181.79093239169808,202.4001937858141
   L 160.4943327448113,173.3751211161338
             A 60,60,0,
             0,1,
             129.21657133671755,184.8516543310406 Z'
												role='img'
											></path>
										</g>
										<g
											className='recharts-layer recharts-pie-sector'
											tabIndex={-1}
										>
											<path
												cx='125'
												cy='125'
												name='fats'
												stroke='#fff'
												fill='var(--color-fats)'
												strokeWidth='5'
												tabIndex={-1}
												className='recharts-sector'
												d='M 181.79093239169808,202.4001937858141
     A 96,96,0,
     0,0,
     221,125.00000000000011
   L 185,125.00000000000007
             A 60,60,0,
             0,1,
             160.4943327448113,173.3751211161338 Z'
												role='img'
											></path>
										</g>
									</g>
									<text
										x='125'
										y='125'
										textAnchor='middle'
										dominantBaseline='middle'
									>
										<tspan
											x='125'
											y='125'
											className='fill-foreground text-3xl font-bold'
										>
											1,675
										</tspan>
										<tspan x='125' y='149' className='fill-muted-foreground'>
											Calories
										</tspan>
									</text>
								</g>
							</svg>
							<div
								tabIndex={-1}
								className='recharts-tooltip-wrapper recharts-tooltip-wrapper-right recharts-tooltip-wrapper-bottom'
								style={{
									visibility: 'hidden',
									pointerEvents: 'none',
									position: 'absolute',
									top: '0px',
									left: '0px',
									transform: 'translate(63.843px, 103.052px)'
								}}
							></div>
						</div>
					</div>
				</div>
			</div>
			<div className='-mt-3 flex flex-col items-center gap-2 p-6 pt-0 text-sm'>
				<div className='flex items-center gap-2 font-medium leading-none tracking-tight'>
					You have lost 4.2 kg of fat this month
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='24'
						height='24'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
						className='lucide lucide-trending-down h-4 w-4'
					>
						<polyline points='22 17 13.5 8.5 8.5 13.5 2 7'></polyline>
						<polyline points='16 17 22 17 22 11'></polyline>
					</svg>
				</div>
			</div>
		</div>
	)
}
