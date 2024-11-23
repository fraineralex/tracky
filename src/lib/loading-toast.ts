import { toast } from 'sonner'

export function loadingToast(loading: string, id: string) {
	const promise = () =>
		new Promise(resolve =>
			setTimeout(() => resolve({ name: 'Sonner' }), 100000)
		)

	toast.promise(promise, {
		loading,
		id
	})

	return () => toast.dismiss(id)
}
