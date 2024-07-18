import SideNav from '~/components/layout/sidenav'

export default function DashboardPage() {
	return (
		<main className='grid grid-cols-6 px-16 pt-16 min-h-full'>
			<SideNav />
			<section className='col-span-5 bg-green-500/10'>
				<h1>Dashboard</h1>
			</section>
		</main>
	)
}
