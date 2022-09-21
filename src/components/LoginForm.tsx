import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CreateUserInput } from '../schema/user.schema'
import { trpc } from '../utils/trpc'

function VerifyToken({ hash }: { hash: string }) {
	const router = useRouter()
	const { data, isLoading } = trpc.useQuery(['user.verify-otp', {
		hash
	}])

	if (isLoading) {
		return <p>Verifying...</p>
	}

	router.push(data?.redirect.includes('login') ? '/' : data?.redirect || '/')

	return <p>Redirecting...</p>
}

function LoginForm() {
	const { handleSubmit, register } = useForm<CreateUserInput>()
	const [success, setSuccess] = useState(false)
	const router = useRouter()
	const { mutate, error } = trpc.useMutation(['user.request-otp'], {
		onSuccess: () => {
			setSuccess(true)
		}
	})


	function onSubmit(values: CreateUserInput) {
		mutate({ ...values, redirect: router.asPath })
	}

	// take path from url
	const hash = router.asPath.split('#token=')[1]

	if (hash) {
		return <VerifyToken hash={hash} />
	}


	return <>
		<div className="w-full max-w-xs">
			<form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
				onSubmit={handleSubmit(onSubmit)}>

				{error && error.message}

				{success && <p className='py-2 font-medium text-md bg-orange-300 text-white text-center rounded'>Check your email</p>}

				<h1 className='mb-2 bg-gray-400 py-2 font-medium text-md text-white text-center rounded focus:outline-none focus:shadow-outline'>Login</h1>
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="username">
						Email
					</label>
					<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="email" type="email" placeholder="john@mail.com"
						{...register('email')}
					/>
				</div>
				<div className="flex items-center justify-between">
					<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						type="submit">
						Login
					</button>
					<Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
						href="/register">Register</Link>
				</div>
			</form>

		</div>


	</>
}

export default LoginForm

