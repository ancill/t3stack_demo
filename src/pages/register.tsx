import Link from 'next/link'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { CreateUserInput } from '../schema/user.schema'
import { trpc } from '../utils/trpc'

function RegisterPage() {
	const { handleSubmit, register } = useForm<CreateUserInput>()
	const router = useRouter()
	const { mutate, error } = trpc.useMutation(['user.register-user'], {
		onSuccess: () => {
			router.push('/login')
		}
	})


	function onSubmit(values: CreateUserInput) {
		mutate(values)
	}

	return <>
		<div className="w-full max-w-xs">
			<form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit(onSubmit)}>
				{error && error.message}
				<h1 className='mb-2 bg-gray-400 py-2 font-medium text-md text-white text-center rounded focus:outline-none focus:shadow-outline'>Register</h1>
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
						Username
					</label>
					<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="username" type="text" placeholder="Tom"
						{...register('name')}
					/>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
						Email
					</label>
					<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="email" type="email" placeholder="john@mail.com"
						{...register('email')}
					/>
				</div>
				<div className="flex items-center justify-between">
					<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
						Register
					</button>
					<Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/login">Login</Link>
				</div>
			</form>
		</div>


	</>
}

export default RegisterPage

